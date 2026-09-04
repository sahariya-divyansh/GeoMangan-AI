from pydantic import BaseModel

class ForecastSchema(BaseModel):
    mine: str
    target: int
    d7: int
    d30: int
    d90: int
    risk: str
    reason: str