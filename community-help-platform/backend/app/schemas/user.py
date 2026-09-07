# app/schemas/user.py
#
# Pydantic schemas define the SHAPE of data coming IN (requests)
# and going OUT (responses) through the API.
# They are separate from SQLAlchemy models — models describe the DB table,
# schemas describe the JSON that travels over HTTP.

from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional


# ─── Input: Register a new user ─────────────────────────────────
class UserCreate(BaseModel):
    """Data the frontend sends when someone registers."""
    name:         str
    email:        EmailStr
    password:     str           # plain password — backend will hash it
    neighborhood: Optional[str] = None
    profession:   Optional[str] = None
    skills:       Optional[str] = None   # comma-separated string
    availability: Optional[str] = None


# ─── Input: Login ────────────────────────────────────────────────
class UserLogin(BaseModel):
    """Data the frontend sends when someone logs in."""
    email:    EmailStr
    password: str


# ─── Output: What the API returns about a user ──────────────────
class UserOut(BaseModel):
    """
    Safe user data returned by the API.
    Notice: password_hash is NOT included — we never send it to the frontend.
    """
    id:           int
    name:         str
    email:        str
    neighborhood: Optional[str]
    profession:   Optional[str]
    skills:       Optional[str]
    availability: Optional[str]
    rating:       float
    created_at:   datetime

    # This tells Pydantic to read data from SQLAlchemy ORM objects
    # (not just plain dicts)
    model_config = {"from_attributes": True}
