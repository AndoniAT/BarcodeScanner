import datetime
import os
from typing import List, Optional

import stripe
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..customers.controllers import get_customer
from ..customers.models import Customer
from ..database import get_db
from ..exceptions import ConditionException, NotFoundException
from ..items.models import Item, PurchasedItem
from .controllers import get_payments_by_customer
from .models import Payment
from .schemas import (PaymentCheckSchema, PaymentCreateSchema, PaymentSchema,
                      PaymentSheetSchema)

payments_router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
    responses={
        400: {"description": "Bad Request"},
        404: {"description": "Not found"},
    }
)


@payments_router.get('/', response_model=List[PaymentSchema])
def get_payments(
    offset: int = 0,
    limit: int = Query(default=100, lte=100),
    db: Session = Depends(get_db)
):
    # ERROR: RecursionError: maximum recursion depth exceeded
    # return get_payments(offset, limit)

    return db.query(Payment).offset(offset).limit(limit).all()


@payments_router.get('/{customer_id}', response_model=List[PaymentSchema])
def get_payments_by_customer_id(
    customer_id: str,
    offset: int = 0,
    limit: int = Query(default=100, lte=100),
    db: Session = Depends(get_db)
):
    # ERROR: Parent instance <Payment at 0x7f88a9185f90> is not bound to 
    #   a Session; lazy load operation of attribute 'customer' cannot 
    #   proceed (Background on this error at: https://sqlalche.me/e/14/bhk3)
    # return get_payments_by_customer(customer_id, offset, limit)

    return db.query(Payment).filter(Payment.customer_id == customer_id).offset(offset).limit(limit).all()

@payments_router.post('/', response_model=PaymentSheetSchema)
def create_sheet(
    payment_sheet: PaymentCreateSchema,
    db: Session = Depends(get_db)
):
    customer: Optional[Customer] = get_customer(payment_sheet.customer_id)

    ephemeral_key = stripe.EphemeralKey.create(
        customer=customer.id,
        stripe_version='2022-08-01',
    )

    customer_stripe = stripe.Customer.retrieve(
        customer.id
    )

    pending_items: dict = {pi.id: pi.amount for pi in payment_sheet.pending_items}
    items_id: List[int] = [pi.id for pi in payment_sheet.pending_items]
    items: List[Item] = db.query(Item).filter(Item.id.in_(items_id)).all()

    if len(items) != len(payment_sheet.pending_items):
        raise NotFoundException(detail="Item not found.")

    price: int = sum([pending_items[i.id] * i.price for i in items])

    payment_intent = stripe.PaymentIntent.create(
        amount=price,
        currency='eur',
        customer=customer_stripe,
        automatic_payment_methods={
            'enabled': True,
        },
    )

    payment: Payment = Payment(
        id=payment_intent.id,
        customer_id=payment_sheet.customer_id
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    purchased_items: List[PurchasedItem] = []
    for key, value in pending_items.items():
        purchased_item: PurchasedItem = PurchasedItem(
            customer_id=payment_sheet.customer_id,
            amount=value,
            item_id=key,
            payment_id=payment.id
        )
        purchased_items.append(purchased_item)
        db.add(purchased_item)

    db.commit()

    return {
        "paymentIntent": payment_intent.client_secret,
        "ephemeralKey": ephemeral_key.secret,
        "customer": customer_stripe["id"],
        "publishableKey": os.environ.get("STRIPE_PK")
    }

@payments_router.post('/check/{payment_intent_id}', response_model=PaymentSchema)
def check_sheet_status_and_get_purchased_items(
    payment_intent_id: str,
    payment_check: PaymentCheckSchema,
    db: Session = Depends(get_db)
):
    payment: Optional[Payment] = db.query(Payment).filter(
        Payment.customer_id == payment_check.customer_id,
        Payment.id == payment_intent_id,
        Payment.is_checked == False
    ).first()

    if not payment:
        raise NotFoundException(detail="Payment not found or already checked.")

    payment_intent = stripe.PaymentIntent.retrieve(
        payment_intent_id
    )

    if not payment_intent:
        raise NotFoundException(detail="Payment intent not found.")

    if not payment_intent.status == "succeeded":
        raise ConditionException(detail="Unsuccessful payment intent.")
    
    amount: int = payment_intent.amount_received

    purchased_items: List[PurchasedItem] = db.query(PurchasedItem).filter(
        PurchasedItem.payment_id == payment.id
    ).all()

    price: int = sum([pi.amount * pi.item.price for pi in purchased_items])

    # validation of the price against the amount paid
    if not price == amount:
        print(price, amount)
        raise ConditionException(detail="Price does not match with amount paid.")

    # payment validation to avoid fraud
    payment.is_checked = True
    payment.checkout_date = datetime.datetime.now()

    db.add(payment)
    db.commit()

    db.refresh(payment)

    return payment
