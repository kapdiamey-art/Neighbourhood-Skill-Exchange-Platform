from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

# Database setup
from app.database.connection import engine, Base, get_db

# Import models so SQLAlchemy registers them BEFORE create_all() runs
import app.models  # noqa: F401  (triggers models/__init__.py which imports User & HelpRequest)

# Import routers
from app.routers import auth, users, requests as requests_router

# ---------------------------------------------------------------------------
# CREATE TABLES
# ---------------------------------------------------------------------------
# Scans every model that inherits from Base (User, HelpRequest, …)
# and creates the corresponding table in MySQL IF it doesn't already exist.
# Safe to run on every startup — it never drops or modifies existing tables.
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------------------
# FASTAPI APPLICATION
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Community Help Platform API",
    description="Backend API for the Neighbourhood Skill Exchange Platform",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://skillexchange-sandy.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# ROUTERS
# ---------------------------------------------------------------------------
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(requests_router.router)


# ---------------------------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Community Help Platform API is running"}


# ---------------------------------------------------------------------------
# DATABASE TEST
# ---------------------------------------------------------------------------
@app.get("/api/db-test")
def db_test(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "success", "message": "Database connection successful"}
