# database/connection.py
#
# Responsible for connecting SQLAlchemy to MySQL using credentials
# read from the .env file (never hard-coded in source code).

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# ---------------------------------------------------------------------------
# Load environment variables from backend/.env
# ---------------------------------------------------------------------------
load_dotenv()

MYSQL_USER     = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_HOST     = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT     = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB       = os.getenv("MYSQL_DB", "community_help")

# ---------------------------------------------------------------------------
# DATABASE URL
# ---------------------------------------------------------------------------
# Format:  dialect+driver://user:password@host:port/database
# mysql+pymysql tells SQLAlchemy to use PyMySQL as the driver.
# PyMySQL is pure Python — no Rust/C compilation needed.
DATABASE_URL = (
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}"
    f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
)

# ---------------------------------------------------------------------------
# ENGINE
# ---------------------------------------------------------------------------
# The engine is the low-level connection pool to MySQL.
# pool_pre_ping=True: tests the connection before using it from the pool,
# preventing "MySQL has gone away" errors after idle periods.
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# ---------------------------------------------------------------------------
# SESSION FACTORY
# ---------------------------------------------------------------------------
# Each call to SessionLocal() creates a fresh, isolated database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ---------------------------------------------------------------------------
# BASE CLASS
# ---------------------------------------------------------------------------
# All database models (User, HelpRequest, …) will inherit from Base.
# Base.metadata keeps a registry of every table we define.
class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# DEPENDENCY — get_db()
# ---------------------------------------------------------------------------
# FastAPI injects this into endpoints via Depends(get_db).
# Opens a session, yields it to the endpoint, then closes it automatically.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
