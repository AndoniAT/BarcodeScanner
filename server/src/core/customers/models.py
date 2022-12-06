from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from ..database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    stripe_id = Column(String)

    purchased_items = relationship("PurchasedItem")
    payments = relationship("Payment")
