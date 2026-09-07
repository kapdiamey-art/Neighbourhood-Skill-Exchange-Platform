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


def _enrich_request(req: HelpRequest, db: Session) -> dict:
    """Helper to add creator and helper contact info to request dict."""
    data = {
        "id": req.id,
        "title": req.title,
        "description": req.description,
        "skill_required": req.skill_required,
        "urgency": req.urgency,
        "status": req.status,
        "created_by": req.created_by,
        "helper_id": req.helper_id,
        "created_at": req.created_at,
        "creator_name": None,
        "creator_email": None,
        "helper_name": None,
        "helper_email": None,
    }

    if req.created_by:
        creator = db.query(User).filter(User.id == req.created_by).first()
        if creator:
            data["creator_name"] = creator.name
            data["creator_email"] = creator.email

    if req.helper_id:
        helper = db.query(User).filter(User.id == req.helper_id).first()
        if helper:
            data["helper_name"] = helper.name
            data["helper_email"] = helper.email

    return data


# ════════════════════════════════════════════════════════════════
# GET /api/requests
# ════════════════════════════════════════════════════════════════
@router.get("/", response_model=List[RequestOut])
def get_all_requests(db: Session = Depends(get_db)):
    """
    Returns all help requests ordered by most recent first.
    """
    requests = db.query(HelpRequest).order_by(HelpRequest.created_at.desc()).all()
    return [_enrich_request(r, db) for r in requests]


# ════════════════════════════════════════════════════════════════
# GET /api/requests/mine?user_id=X
# ════════════════════════════════════════════════════════════════
@router.get("/mine", response_model=List[RequestOut])
def get_my_requests(user_id: int, db: Session = Depends(get_db)):
    """
    Returns all requests created by a specific user.
    """
    requests = (
        db.query(HelpRequest)
        .filter(HelpRequest.created_by == user_id)
        .order_by(HelpRequest.created_at.desc())
        .all()
    )
    return [_enrich_request(r, db) for r in requests]


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

    return _enrich_request(new_request, db)


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
    return _enrich_request(req, db)
