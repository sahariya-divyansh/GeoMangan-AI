from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.mines import MineSchema
from app.db.base import get_db
from app.db.models import Mine
from typing import List

router = APIRouter(prefix="/api/mines", tags=["Mines"])

@router.get("/", response_model=List[MineSchema])
def get_mines(db: Session = Depends(get_db)):
    return db.query(Mine).all()

@router.get("/{mine_id}", response_model=MineSchema)
def get_mine(mine_id: str, db: Session = Depends(get_db)):
    mine = db.query(Mine).filter(Mine.id == mine_id).first()
    if not mine:
        raise HTTPException(status_code=404, detail="Mine not found")
    return mine