from pydantic import BaseModel


class CustomerSchema(BaseModel):
    id: int
    stripe_id: str

    class Config:
        orm_mode = True
