from typing import List, Optional

from fastapi import APIRouter, Query

from .controllers import add_customer, get_customer, get_customers
from .schemas import AddCustomerSchema, CustomerSchema

customers_router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
    responses={
        404: {"description": "Not found"},
    }
)


@customers_router.get('/', response_model=List[CustomerSchema])
def read_customers(
    offset: int = 0,
    limit: int = Query(default=100, lte=100),
):
    return get_customers(offset, limit)


@customers_router.get('/{customer_id}', response_model=Optional[CustomerSchema])
def read_customer(
    customer_id: str,
):
    return get_customer(customer_id)


@customers_router.post('/', response_model=Optional[CustomerSchema])
def create_customer(
    customer: AddCustomerSchema,
):
    return add_customer(customer)
