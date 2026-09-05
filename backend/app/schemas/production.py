from pydantic import BaseModel
from typing import List

class ForecastSchema(BaseModel):
    mine: str
    target: int
    d7: int
    d30: int
    d90: int
    risk: str
    reason: str

class LSTMInput(BaseModel):
    equipment_availability: float
    rainfall: float
    blast_delay: float
    ore_grade: float
    working_days: int
    prev_month_production: float
    month: int

class LSTMResult(BaseModel):
    predicted: int
    model_type: str
    confidence_interval: List[int]
    risk: str