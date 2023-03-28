from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from ..database import Base


class Customer(Base):
    __tablename__ = "customers"

    # Stripe customer id
    id = Column(String, primary_key=True, autoincrement=False)
    email = Column(String, unique=True, index=True)
    
    purchased_items = relationship("PurchasedItem")
    payments = relationship("Payment")
