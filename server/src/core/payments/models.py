
from sqlalchemy import Boolean, Column, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship

from ..database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, autoincrement=False, index=True)
    is_checked = Column(Boolean, default=False)

    checkout_date = Column(DateTime, nullable=True)

    customer_id = Column(String, ForeignKey("customers.id"))
    customer = relationship("Customer", back_populates="payments")

    purchased_items = relationship("PurchasedItem")