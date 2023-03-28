from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse


class NotFoundException(Exception):
    def __init__(self, detail: str):
        self.detail = detail

class ConditionException(Exception):
    def __init__(self, detail: str):
        self.detail = detail

def not_found_exception_handler(request: Request, exc: NotFoundException):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"message": exc.detail},
    )

def condition_exception_handler(request: Request, exc: ConditionException):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"message": exc.detail},
    )











