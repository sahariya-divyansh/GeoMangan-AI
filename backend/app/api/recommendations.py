from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.recommendations import RecommendationSchema
from app.db.base import get_db
from app.db.models import RecommendationRecord
from typing import List

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("/", response_model=List[RecommendationSchema])
def get_recommendations(db: Session = Depends(get_db)):
    return db.query(RecommendationRecord).all()

@router.patch("/{rec_id}/decide", response_model=RecommendationSchema)
def decide(rec_id: str, status: str, db: Session = Depends(get_db)):
    rec = db.query(RecommendationRecord).filter(RecommendationRecord.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    rec.status = status
    db.commit()
    db.refresh(rec)
    return rec