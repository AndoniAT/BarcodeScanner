from fastapi import FastAPI
from src.core import create_app, create_worker

app: FastAPI = create_app()
