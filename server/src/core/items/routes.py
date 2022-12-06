from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .models import Item
from .schemas import AddItemSchema, ItemSchema

item_router = APIRouter(
    prefix="/items",
    tags=["Items"]
)


@item_router.post("/", response_model=ItemSchema)
def add_item(
    item: AddItemSchema,
    db: Session = Depends(get_db)
):
    if item.price < 100:
        raise HTTPException(
            status_code=404, detail="Price must be greater or equal than 100.")

    db_item: Item = Item(**item.dict())

    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    return db_item


@item_router.get("/{item_id}", response_model=ItemSchema)
def get_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    item: Optional[Item] = db.query(Item).filter(Item.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    return item


@item_router.get("/", response_model=List[ItemSchema])
def get_items(
    offset: int = 0,
    limit: int = Query(default=100, lte=100),
    db: Session = Depends(get_db)
):
    items: List[Item] = db.query(Item).offset(offset).limit(limit).all()

    return items


@item_router.delete("/", response_model=ItemSchema)
def remove_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    item: Optional[Item] = db.query(Item).filter(Item.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    db.delete(item)
    db.commit()

    return item
