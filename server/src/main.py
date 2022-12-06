from fastapi import FastAPI
from src.core import create_app

app: FastAPI = create_app()
