from fastapi import APIRouter
from app.schemas.production import ForecastSchema, LSTMInput, LSTMResult
from app.schemas.diagnosis import DiagnosisInput, DiagnosisResult
from app.services.diagnosis import diagnose
from app.ml.lstm_forecast import predict_lstm
from typing import List

router = APIRouter(prefix="/api/production", tags=["Production"])

FORECASTS = [
    ForecastSchema(mine="Balaghat Mine", target=94000, d7=21400, d30=91300, d90=278500, risk="Medium", reason="Ventilation downtime and haulage congestion may keep output below target."),
    ForecastSchema(mine="Ukwa Mine",     target=38500, d7=9800,  d30=40700, d90=121400, risk="Low",    reason="Stable ore feed and improved grade control support target overrun."),
    ForecastSchema(mine="Tirodi Mine",   target=46000, d7=10350, d30=43800, d90=132600, risk="Medium", reason="Monsoon-affected road availability is slowing dispatch cycles."),
    ForecastSchema(mine="Kandri Mine",   target=52500, d7=10900, d30=48700, d90=145800, risk="High",   reason="Ore dilution and crusher maintenance are pressuring recovery rates."),
    ForecastSchema(mine="Munsar Mine",   target=61500, d7=15100, d30=63200, d90=188900, risk="Low",    reason="Consistent bench sequencing and stockpile blending reduce variance."),
]

@router.get("/", response_model=List[ForecastSchema])
def get_forecasts():
    return FORECASTS

@router.post("/diagnose", response_model=DiagnosisResult)
def diagnose_endpoint(data: DiagnosisInput):
    return diagnose(
        equipment_availability=data.equipment_availability,
        rainfall_24h=data.rainfall_24h,
        blasting_delay=data.blasting_delay,
        predicted_grade=data.predicted_grade,
        target_grade=data.target_grade,
        predicted=data.predicted,
        target=data.target
    )

@router.post("/lstm-forecast", response_model=LSTMResult)
def lstm_forecast_endpoint(data: LSTMInput):
    return predict_lstm(
        equipment_availability=data.equipment_availability,
        rainfall=data.rainfall,
        blast_delay=data.blast_delay,
        ore_grade=data.ore_grade,
        working_days=data.working_days,
        prev_month_production=data.prev_month_production,
        month=data.month
    )