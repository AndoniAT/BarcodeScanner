from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Integer, default=0)

    purchased_items = relationship("PurchasedItem")


class PurchasedItem(Base):
    __tablename__ = "purchased_items"

    id = Column(Integer, primary_key=True, index=True)

    amount = Column(Integer, nullable=False)

    payment_id = Column(Integer, ForeignKey("payments.id"))
    payment = relationship("Payment", back_populates="purchased_items")

    customer_id = Column(String, ForeignKey("customers.id"))
    customer = relationship("Customer", back_populates="purchased_items")

    item_id = Column(Integer, ForeignKey("items.id"))
    item = relationship("Item", back_populates="purchased_items")
