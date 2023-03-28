from pydantic import BaseModel


class CustomerBase(BaseModel):
    id: str
    email: str

    class Config:
        orm_mode = True

class CustomerSchema(CustomerBase):
    pass

class AddCustomerSchema(BaseModel):
    email: str

    class Config:
        orm_mode = True