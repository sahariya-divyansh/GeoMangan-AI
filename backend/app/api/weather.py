from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.weather import WeatherResult
from app.services.weather import fetch_weather
from app.db.base import get_db
from app.db.models import Mine

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("/{mine_id}", response_model=WeatherResult)
async def get_weather(mine_id: str, db: Session = Depends(get_db)):
    mines = db.query(Mine).all()
    target_mine = None
    for mine in mines:
        if mine.id == mine_id or mine.id == f"mn-{mine_id}" or mine.id.replace("mn-", "") == mine_id:
            target_mine = mine
            break

    if not target_mine:
        raise HTTPException(status_code=404, detail="Mine not found")

    try:
        weather_data = await fetch_weather(target_mine.lat, target_mine.lng)
        return WeatherResult(**weather_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather service error: {str(e)}")
