from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

@router.post("", response_model=schemas.SessionResponse, status_code=201)
def create_session(payload: schemas.SessionCreate, db: DBSession = Depends(get_db)):
    # create model.Session from payload, add to db, commit, refresh, and return the session.
    session = models.Session(**payload.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.get("", response_model=list[schemas.SessionResponse])
def get_sessions(db: DBSession = Depends(get_db)):
    # get all sessions, ordered by 'completed_at' desc.
    sessions = db.query(models.Session).order_by(models.Session.completed_at.desc()).all()
    return sessions