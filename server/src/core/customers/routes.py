import os
from typing import List, Optional

import stripe
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from .models import Customer
from .schemas import CustomerSchema

sk_stripe: str = os.environ.get("STRIPE_SK")
pk_stripe: str = os.environ.get("STRIPE_PK")
stripe.api_key = sk_stripe


customers_router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@customers_router.get('/', response_model=List[CustomerSchema])
def get_customers(
    db: Session = Depends(get_db)
):
    customers: List[Customer] = db.query(Customer).all()

    return customers


@customers_router.get('/{customer_id}', response_model=Optional[CustomerSchema])
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    customer: Optional[Customer] = db.query(
        Customer).filter(Customer.id == customer_id).first()

    return customer


@customers_router.post('/')
def add_customer(
    db: Session = Depends(get_db)
):
    customer = stripe.Customer.create()

    customer_db: Customer = Customer(stripe_id=customer["id"])

    db.add(customer_db)
    db.commit()
    db.refresh(customer_db)

    return customer_db
