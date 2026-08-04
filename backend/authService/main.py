from fastapi import FastAPI
from dotenv import load_dotenv
from app.routes.appRoute import appRouter
from app.config.db import connect_db

load_dotenv()

app = FastAPI()

# db connection
connect_db()

app.include_router(appRouter, prefix="/auth/api/v1")
