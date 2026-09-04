from pydantic import BaseModel
from typing import Literal

class MineSchema(BaseModel):
    id: str
    name: str
    state: str
    lat: float
    lng: float
    monthly_target: int
    actual: int
    risk: Literal['High', 'Medium', 'Low']