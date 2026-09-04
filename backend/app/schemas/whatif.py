from pydantic import BaseModel

class WhatIfInput(BaseModel):
    rain: float = 12
    downtime: float = 4.5
    blast: float = 1
    trucks: int = 0

class WhatIfResult(BaseModel):
    baseline: int
    predicted: int
    delta: int
    risk: str