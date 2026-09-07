# database/connection.py
#
# This file is responsible for ONE thing: teaching SQLAlchemy how to talk
# to our SQLite database. Everything defined here will be imported and used
# by other parts of the app.

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# ---------------------------------------------------------------------------
# 1. DATABASE URL
# ---------------------------------------------------------------------------
# This string tells SQLAlchemy three things:
#   - WHAT kind of database  → sqlite
#   - HOW to access it       → /// means "relative to current directory"
#   - WHERE the file lives   → community_help.db
#
# When the app starts, SQLite will look for this file.
# If the file does not exist yet, SQLite creates it automatically.
#
# Full path example on your machine:
#   backend/community_help.db
DATABASE_URL = "sqlite:///./community_help.db"

# ---------------------------------------------------------------------------
# 2. ENGINE
# ---------------------------------------------------------------------------
# The engine is the core connection to the database.
# Think of it like a phone line between your Python code and the .db file.
# Nothing actually happens until you "make a call" (open a session).
#
# connect_args={"check_same_thread": False}
#   SQLite was designed for single-threaded use, but FastAPI handles many
#   requests at the same time (multi-threaded). This argument tells SQLite:
#   "It's okay — we'll manage thread safety ourselves."
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# ---------------------------------------------------------------------------
# 3. SESSION FACTORY (SessionLocal)
# ---------------------------------------------------------------------------
# A "session" is a temporary workspace for a single database conversation.
# SessionLocal is a factory — calling SessionLocal() creates a new session.
#
# autocommit=False  → changes are NOT saved automatically; we decide when to save
# autoflush=False   → changes are NOT sent to the DB automatically mid-session
# bind=engine       → tells the session which database (engine) to use
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# ---------------------------------------------------------------------------
# 4. BASE CLASS
# ---------------------------------------------------------------------------
# Base is the parent class that all future database models will inherit from.
# When you later write:
#
#   class User(Base):
#       __tablename__ = "users"
#       ...
#
# SQLAlchemy uses Base to understand that User is a database table,
# and Base.metadata knows about every table defined this way.
#
# We call Base.metadata.create_all(engine) at startup to create the tables.
class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# 5. DEPENDENCY — get_db()
# ---------------------------------------------------------------------------
# FastAPI uses "dependency injection" to pass a database session into each
# endpoint automatically. This function:
#
#   1. Opens a fresh session for each incoming HTTP request
#   2. Hands it to the endpoint function
#   3. Closes it automatically when the request is done (even on errors)
#
# The "yield" keyword makes this a generator — code before yield runs first,
# the endpoint runs, then code after yield (the finally block) runs at the end.
def get_db():
    db = SessionLocal()        # Open a new session
    try:
        yield db               # Hand the session to the endpoint
    finally:
        db.close()             # Always close the session when done
