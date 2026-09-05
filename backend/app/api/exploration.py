from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.exploration import ZoneSchema
from app.db.base import get_db
from app.db.models import ProspectivityZone
from typing import List

router = APIRouter(prefix="/api/exploration", tags=["Exploration"])

@router.get("/", response_model=List[ZoneSchema])
def get_zones(db: Session = Depends(get_db)):
    return db.query(ProspectivityZone).all()

@router.get("/{zone_id}", response_model=ZoneSchema)
def get_zone(zone_id: str, db: Session = Depends(get_db)):
    zone = db.query(ProspectivityZone).filter(ProspectivityZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    return zone