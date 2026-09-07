# app/routers/requests.py
#
# Handles help requests.
# Routes:
#   GET  /api/requests             → all open requests
#   POST /api/requests             → create a new request
#   GET  /api/requests/mine        → requests posted by a specific user

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.connection import get_db
from app.models.request import HelpRequest
from app.models.user import User
from app.schemas.request import RequestCreate, RequestOut

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
    The user_id is passed as a query parameter: /api/requests/mine?user_id=1
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

    Steps:
    1. Verify the user exists
    2. Create the HelpRequest row
    3. Save to MySQL and return the created request
    """
    # 1. Verify the user exists
    user = db.query(User).filter(User.id == data.created_by).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # 2. Create the request
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
