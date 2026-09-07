# app/models/request.py
#
# Defines the 'help_requests' table in MySQL.

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.database.connection import Base


class HelpRequest(Base):
    """
    Represents a community member's help request.

    Columns:
        id             – auto-incrementing primary key
        title          – short title e.g. "Fix leaking kitchen tap"
        description    – full description of what help is needed
        skill_required – e.g. "Plumbing"
        urgency        – "Low" | "Medium" | "High"
        status         – "Open" | "In Progress" | "Completed"
        created_by     – foreign key → users.id (who posted the request)
        created_at     – timestamp when created
    """
    __tablename__ = "help_requests"

    id             = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title          = Column(String(200), nullable=False)
    description    = Column(Text, nullable=True)
    skill_required = Column(String(100), nullable=True)
    urgency        = Column(String(20), default="Medium")
    status         = Column(String(20), default="Open")
    created_by     = Column(Integer, ForeignKey("users.id"), nullable=False)
    helper_id      = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at     = Column(DateTime, default=datetime.utcnow)
