from fastapi import APIRouter
from app.schemas.whatif import WhatIfInput, WhatIfResult

router = APIRouter(prefix="/api/whatif", tags=["WhatIf"])

BASELINE = 16800

@router.post("/", response_model=WhatIfResult)
def simulate(data: WhatIfInput):
    predicted = round(
        BASELINE
        - (data.rain - 12) * 80
        - (data.downtime - 4.5) * 200
        - (data.blast - 1) * 150
        + data.trucks * 900
    )
    delta = predicted - BASELINE
    risk = "High" if predicted < 14000 else "Medium" if predicted < 16000 else "Low"
    return WhatIfResult(baseline=BASELINE, predicted=predicted, delta=delta, risk=risk)