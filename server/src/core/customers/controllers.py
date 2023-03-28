from typing import List, Optional

import stripe
from sqlalchemy.orm import Session

from ..customers.models import Customer
from ..database import engine
from ..exceptions import ConditionException, NotFoundException
from .schemas import AddCustomerSchema


def get_customers(offset: int, limit: int) -> List[Customer]:
    with Session(engine) as db:
        return db.query(Customer).offset(offset).limit(limit).all()


def get_customer(customer_id: int) -> Optional[Customer]:
    with Session(engine) as db:
        customer: Optional[Customer] = db.query(
            Customer).filter(Customer.id == customer_id).first()

        if not customer:
            raise NotFoundException("Customer not found")

        return customer


def add_customer(customer: AddCustomerSchema) -> Optional[Customer]:
    with Session(engine) as db:
        if db.query(Customer).filter(Customer.email == customer.email).first():
            raise ConditionException("Customer already exists")

        customer_stripe = stripe.Customer.create()
        customer_db: Customer = Customer(id=customer_stripe.id, email=customer.email)

        db.add(customer_db)
        db.commit()
        db.refresh(customer_db)

        return customer_db
