import os

import stripe
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from . import customers, items, payments
from .database import Base, SessionLocal, engine

sk_stripe: str = os.environ.get("STRIPE_SK")
pk_stripe: str = os.environ.get("STRIPE_PK")
stripe.api_key = sk_stripe

def create_app() -> FastAPI:
    Base.metadata.create_all(bind=engine)

    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def db_session_middleware(request: Request, call_next):
        response = Response("Internal server error", status_code=500)
        try:
            request.state.db = SessionLocal()
            response = await call_next(request)
        finally:
            request.state.db.close()
        return response

    app.include_router(customers.routes.customers_router)
    app.include_router(items.routes.item_router)
    app.include_router(payments.routes.payments_router)

    return app
