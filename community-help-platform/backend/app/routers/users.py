# app/routers/users.py
#
# Handles reading user data.
# Routes:
#   GET /api/users        → list all users (for Find Help page)
#   GET /api/users/{id}   → get a single user's profile

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter(prefix="/api/users", tags=["Users"])


# ════════════════════════════════════════════════════════════════
# GET /api/users
# ════════════════════════════════════════════════════════════════
@router.get("/", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    """
    Returns all registered users.
    Used by the Find Help page to show community members.
    """
    return db.query(User).all()


# ════════════════════════════════════════════════════════════════
# GET /api/users/{user_id}
# ════════════════════════════════════════════════════════════════
@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Returns a single user by their ID.
    Used by the Profile page.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user
