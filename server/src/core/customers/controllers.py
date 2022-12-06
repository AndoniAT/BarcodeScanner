from typing import List, Optional

import stripe
from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..customers.models import Customer
from ..database import engine


def get_customers(offset: int, limit: int) -> List[Customer]:
    with Session(engine) as db:
        return db.query(Customer).offset(offset).limit(limit).all()


def get_customer(customer_id: int) -> Optional[Customer]:
    with Session(engine) as db:
        customer: Optional[Customer] = db.query(
            Customer).filter(Customer.id == customer_id).first()

        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found.")

        return customer


def add_customer() -> Optional[Customer]:
    with Session(engine) as db:
        customer = stripe.Customer.create()
        customer_db: Customer = Customer(stripe_id=customer["id"])

        db.add(customer_db)
        db.commit()
        db.refresh(customer_db)

        return customer_db
