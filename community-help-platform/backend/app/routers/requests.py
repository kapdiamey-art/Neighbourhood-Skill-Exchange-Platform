# app/routers/requests.py
#
# Handles help requests.
# Routes:
#   GET   /api/requests                  → all open requests
#   POST  /api/requests                  → create a new request
#   GET   /api/requests/mine             → requests posted by a specific user
#   PATCH /api/requests/{request_id}/status → update request status & helper

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.connection import get_db
from app.models.request import HelpRequest
from app.models.user import User
from app.schemas.request import RequestCreate, RequestStatusUpdate, RequestOut

router = APIRouter(prefix="/api/requests", tags=["Help Requests"])


# ════════════════════════════════════════════════════════════════
# GET /api/requests
# ════════════════════════════════════════════════════════════════
@router.get("/", response_model=List[RequestOut])
def get_all_requests(db: Session = Depends(get_db)):
    """
    Returns all help requests ordered by most recent first.
    """
    return db.query(HelpRequest).order_by(HelpRequest.created_at.desc()).all()


# ════════════════════════════════════════════════════════════════
# GET /api/requests/mine?user_id=X
# ════════════════════════════════════════════════════════════════
@router.get("/mine", response_model=List[RequestOut])
def get_my_requests(user_id: int, db: Session = Depends(get_db)):
    """
    Returns all requests created by a specific user.
    """
    return (
        db.query(HelpRequest)
        .filter(HelpRequest.created_by == user_id)
        .order_by(HelpRequest.created_at.desc())
        .all()
    )


# ════════════════════════════════════════════════════════════════
# POST /api/requests
# ════════════════════════════════════════════════════════════════
@router.post("/", response_model=RequestOut, status_code=201)
def create_request(data: RequestCreate, db: Session = Depends(get_db)):
    """
    Create a new help request.
    """
    user = db.query(User).filter(User.id == data.created_by).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    new_request = HelpRequest(
        title          = data.title,
        description    = data.description,
        skill_required = data.skill_required,
        urgency        = data.urgency or "Medium",
        status         = "Open",
        created_by     = data.created_by,
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request


# ════════════════════════════════════════════════════════════════
# PATCH /api/requests/{request_id}/status
# ════════════════════════════════════════════════════════════════
@router.patch("/{request_id}/status", response_model=RequestOut)
def update_request_status(
    request_id: int,
    data: RequestStatusUpdate,
    db: Session = Depends(get_db)
):
    """
    Update request status ("In Progress" or "Completed") and set helper_id.
    """
    req = db.query(HelpRequest).filter(HelpRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found.")

    req.status = data.status
    if data.helper_id is not None:
        req.helper_id = data.helper_id

    db.commit()
    db.refresh(req)
    return req
