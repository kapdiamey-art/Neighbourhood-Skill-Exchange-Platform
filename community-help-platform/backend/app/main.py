from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

# Import everything we set up in connection.py
from app.database.connection import engine, Base, get_db

# ---------------------------------------------------------------------------
# DATABASE INITIALISATION
# ---------------------------------------------------------------------------
# Base.metadata.create_all() scans every class that inherits from Base
# (i.e., every model/table we define later) and creates the corresponding
# table in the SQLite database IF it does not already exist.
#
# Right now we have no models yet, so this does nothing visible —
# but it DOES create the community_help.db file on disk.
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------------------
# FASTAPI APPLICATION
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Community Help Platform API",
    description="Backend API for the Neighbourhood Skill Exchange / Community Help Platform",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------------------------
# Allow the React dev server (Vite default: port 5173) and any localhost
# origin to communicate with this backend during development.
origins = [
    "http://localhost:5173",   # Vite dev server (React frontend)
    "http://localhost:3000",   # Create-React-App fallback
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Which frontend URLs are allowed
    allow_credentials=True,       # Allow cookies / auth headers
    allow_methods=["*"],          # Allow all HTTP methods (GET, POST, PUT, DELETE …)
    allow_headers=["*"],          # Allow all request headers
)


# ---------------------------------------------------------------------------
# Health-check endpoint
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health_check():
    """
    Returns a simple JSON response confirming the API is up and running.
    No authentication required.
    """
    return {
        "status": "ok",
        "message": "Community Help Platform API is running",
    }


# ---------------------------------------------------------------------------
# Database connection test endpoint
# ---------------------------------------------------------------------------
@app.get("/api/db-test")
def db_test(db: Session = Depends(get_db)):
    """
    Tests whether FastAPI can successfully open a session and
    execute a query against the SQLite database.

    How it works:
      1. FastAPI calls get_db() via Depends() — this opens a Session.
      2. We run a trivial SQL query: SELECT 1
         (the simplest possible query — every database understands it)
      3. If no exception is raised, the connection works.
      4. get_db() automatically closes the session when we return.
    """
    # text() wraps a raw SQL string so SQLAlchemy can execute it safely.
    # "SELECT 1" is the universal "are you alive?" query for any SQL database.
    db.execute(text("SELECT 1"))

    return {
        "status": "success",
        "message": "Database connection successful",
    }
