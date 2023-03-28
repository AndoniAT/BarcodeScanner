import os
from typing import Any

import stripe
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import customers, items, payments
from .database import Base, SessionLocal, engine
from .exceptions import (ConditionException, NotFoundException,
                         condition_exception_handler,
                         not_found_exception_handler)

sk_stripe: str = os.environ.get("STRIPE_SK")
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

    app.add_exception_handler(NotFoundException, not_found_exception_handler)
    app.add_exception_handler(ConditionException, condition_exception_handler)

    @app.middleware("http")
    async def db_session_middleware(request: Request, call_next: Any):
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
