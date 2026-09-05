from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)