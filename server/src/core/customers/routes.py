from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .models import Customer

from ..database import get_db
from .controllers import add_customer, get_customer, get_customers
from .schemas import CustomerSchema

customers_router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@customers_router.get('/', response_model=List[CustomerSchema])
def read_customers(
    offset: int = 0,
    limit: int = Query(default=100, lte=100),
):
    return get_customers(offset, limit)


@customers_router.get('/{customer_id}', response_model=Optional[CustomerSchema])
def read_customer(
    customer_id: int,
):
    return get_customer(customer_id)


@customers_router.post('/')
def create_customer():
    return add_customer()
