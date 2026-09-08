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

import urllib.parse

# ---------------------------------------------------------------------------
# DATABASE URL
# ---------------------------------------------------------------------------
# Format:  dialect+driver://user:password@host:port/database
# mysql+pymysql tells SQLAlchemy to use PyMySQL as the driver.
# urllib.parse.quote_plus encodes special characters like '@' in passwords.
encoded_password = urllib.parse.quote_plus(MYSQL_PASSWORD)
DATABASE_URL = (
    f"mysql+pymysql://{MYSQL_USER}:{encoded_password}"
    f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
)

SSL_MODE = os.getenv("MYSQL_SSL_MODE", "")

connect_args = {}
if SSL_MODE.upper() in ["REQUIRED", "TRUE"]:
    connect_args = {"ssl": {}}

# ---------------------------------------------------------------------------
# ENGINE
# ---------------------------------------------------------------------------
# pool_pre_ping=True: tests the connection before using it from the pool.
# connect_args: passes SSL requirements if specified (e.g. for Aiven cloud MySQL).
engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args=connect_args)

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
