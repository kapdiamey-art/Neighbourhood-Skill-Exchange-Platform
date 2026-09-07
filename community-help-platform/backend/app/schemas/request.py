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
    created_at:     datetime

    model_config = {"from_attributes": True}
