from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from ..items.schemas import PendingItem, PurchasedItem

from ..customers.schemas import CustomerSchema


class PaymentSheetSchema(BaseModel):
    paymentIntent: str
    ephemeralKey: str
    customer: str
    publishableKey: str


class PaymentCheckSchema(BaseModel):
    customer_id: int


class PaymentCreateSchema(BaseModel):
    pending_items: List[PendingItem]
    customer_id: int


class PaymentSchema(BaseModel):
    id: str
    checkout_date: datetime
    is_checked: bool
    customer: Optional[CustomerSchema]
    purchased_items: List[PurchasedItem]

    class Config:
        orm_mode = True