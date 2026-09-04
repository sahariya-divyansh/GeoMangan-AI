from pydantic import BaseModel
from typing import Literal

class ZoneSchema(BaseModel):
    id: str
    mine_id: str
    lat: float
    lng: float
    score: int
    confidence: Literal['High', 'Medium', 'Low']
    ndvi: float
    iron_index: float
    action: str