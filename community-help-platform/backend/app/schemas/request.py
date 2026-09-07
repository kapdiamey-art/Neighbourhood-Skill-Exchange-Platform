# app/schemas/request.py
#
# Pydantic schemas for HelpRequest — defines the API input/output shape.

from datetime import datetime
from pydantic import BaseModel
from typing import Optional


# ─── Input: Create a new help request ───────────────────────────
class RequestCreate(BaseModel):
    """Data the frontend sends when submitting a help request."""
    title:          str
    description:    Optional[str] = None
    skill_required: Optional[str] = None
    urgency:        Optional[str] = "Medium"
    created_by:     int            # user ID of the logged-in user


# ─── Input: Update request status ────────────────────────────────
class RequestStatusUpdate(BaseModel):
    """Data sent when offering help or completing a request."""
    status:     str                 # "Open" | "In Progress" | "Completed"
    helper_id:  Optional[int] = None # user ID who offered/accepted to help


# ─── Output: What the API returns about a request ───────────────
class RequestOut(BaseModel):
    """Help request data returned by the API."""
    id:             int
    title:          str
    description:    Optional[str]
    skill_required: Optional[str]
    urgency:        str
    status:         str
    created_by:     int
    creator_name:   Optional[str] = None
    creator_email:  Optional[str] = None
    helper_id:      Optional[int] = None
    helper_name:    Optional[str] = None
    helper_email:   Optional[str] = None
    created_at:     datetime

    model_config = {"from_attributes": True}
