from pydantic import BaseModel, ConfigDict
from typing import Literal

class RecommendationSchema(BaseModel):
    id: str
    mine: str
    severity: str
    title: str
    reason: str
    recovery: str
    status: Literal['Pending', 'Approved', 'Rejected']

    model_config = ConfigDict(from_attributes=True)