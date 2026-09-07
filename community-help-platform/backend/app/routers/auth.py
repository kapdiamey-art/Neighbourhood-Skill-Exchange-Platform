# app/routers/auth.py
#
# Handles user registration and login.
# Routes:
#   POST /api/auth/register  → create a new account
#   POST /api/auth/login     → verify credentials and return user data

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut

# APIRouter is like a mini-FastAPI — groups related routes together.
# The prefix means every route here starts with /api/auth
router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ─── Helper: hash a plain-text password ─────────────────────────
def hash_password(plain: str) -> str:
    """
    Converts a plain password into a bcrypt hash.
    bcrypt is a one-way function — you can NEVER reverse it to get the
    original password. To verify, you hash again and compare hashes.
    """
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


# ─── Helper: verify a plain password against a stored hash ──────
def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


# ════════════════════════════════════════════════════════════════
# POST /api/auth/register
# ════════════════════════════════════════════════════════════════
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.

    Steps:
    1. Check if the email is already taken
    2. Hash the password (never store plain text)
    3. Create a User row in MySQL
    4. Return the new user (without the password hash)
    """
    # 1. Check for duplicate email
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    # 2. Hash the password
    hashed = hash_password(user_data.password)

    # 3. Create the User object and save to DB
    new_user = User(
        name          = user_data.name,
        email         = user_data.email,
        password_hash = hashed,
        neighborhood  = user_data.neighborhood,
        profession    = user_data.profession,
        skills        = user_data.skills,
        availability  = user_data.availability,
    )
    db.add(new_user)       # stage the new row
    db.commit()            # save to MySQL
    db.refresh(new_user)   # reload to get the auto-generated id & created_at

    return new_user


# ════════════════════════════════════════════════════════════════
# POST /api/auth/login
# ════════════════════════════════════════════════════════════════
@router.post("/login", response_model=UserOut)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Log in with email + password.

    Steps:
    1. Find user by email
    2. Verify the password against the stored hash
    3. Return user data (frontend stores it in localStorage)
    """
    # 1. Find user
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # 2. Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # 3. Return user (UserOut schema strips out password_hash automatically)
    return user
