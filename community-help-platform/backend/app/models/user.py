# app/models/user.py
#
# Defines the 'users' table in MySQL.
# Each attribute here becomes a column in the database.

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from app.database.connection import Base


class User(Base):
    """
    Represents a registered community member.

    Columns:
        id            – auto-incrementing primary key
        name          – full name
        email         – unique login identifier
        password_hash – bcrypt hash (we NEVER store the plain password)
        neighborhood  – e.g. "Kothrud, Pune"
        profession    – e.g. "Web Developer"
        skills        – comma-separated string e.g. "React,Node.js,Python"
        availability  – e.g. "Weekends"
        rating        – average star rating (0.0 – 5.0)
        created_at    – timestamp when the account was created
    """
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name          = Column(String(100), nullable=False)
    email         = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    neighborhood  = Column(String(100), nullable=True)
    profession    = Column(String(100), nullable=True)
    skills        = Column(Text, nullable=True)          # comma-separated
    availability  = Column(String(50), nullable=True)
    rating        = Column(Float, default=0.0)
    created_at    = Column(DateTime, default=datetime.utcnow)
