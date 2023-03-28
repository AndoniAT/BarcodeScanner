from typing import List

from sqlalchemy.orm import Session

from ..database import engine, get_db
from .models import Payment


def get_payments(offset: int, limit: int) -> List[Payment]:
    with Session(engine) as db:
        return db.query(Payment).offset(offset).limit(limit).all()


def get_payments_by_customer(customer_id: str, offset: int, limit: int) -> List[Payment]:
    with Session(engine) as db:
        return db.query(Payment).filter(Payment.customer_id == customer_id).offset(offset).limit(limit).all()
