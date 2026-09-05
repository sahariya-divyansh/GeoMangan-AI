from pydantic import BaseModel
from typing import Optional

class DiagnosisInput(BaseModel):
    equipment_availability: float
    rainfall_24h: float
    blasting_delay: float
    predicted_grade: float
    target_grade: float
    predicted: int
    target: int

class DiagnosisResult(BaseModel):
    primary_reason: str
    primary_contribution: float
    secondary_reason: Optional[str] = None
    secondary_contribution: Optional[float] = None
    shortfall_probability: float
    shortfall_tonnes: int
    suggested_action: str
