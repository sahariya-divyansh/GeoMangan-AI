from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.production import ForecastSchema, LSTMInput, LSTMResult
from app.schemas.diagnosis import DiagnosisInput, DiagnosisResult
from app.services.diagnosis import diagnose
from app.ml.lstm_forecast import predict_lstm
from app.db.base import get_db
from app.db.models import ForecastRecord
from typing import List

router = APIRouter(prefix="/api/production", tags=["Production"])

@router.get("/", response_model=List[ForecastSchema])
def get_forecasts(db: Session = Depends(get_db)):
    return db.query(ForecastRecord).all()

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