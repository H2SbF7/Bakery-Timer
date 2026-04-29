from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes.sessions import router
from fastapi.staticfiles import StaticFiles
from pathlib import Path
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    Base.metadata.create_all(bind=engine)
    yield
    # No special shutdown actions needed

app = FastAPI(lifespan=lifespan, title="Bakery Timer API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
app.include_router(router)

app.mount("/", StaticFiles(directory="frontend", html=True), name="static")