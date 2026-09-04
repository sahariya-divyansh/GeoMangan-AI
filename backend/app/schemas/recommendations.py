from pydantic import BaseModel
from typing import Literal

class RecommendationSchema(BaseModel):
    id: str
    mine: str
    severity: str
    title: str
    reason: str
    recovery: str
    status: Literal['Pending', 'Approved', 'Rejected']