from fastapi import APIRouter
from pydantic import BaseModel
from app.ml.prospectivity import predict_zone
from app.ml.forecast import predict_production
from app.ml.anomaly import detect_anomaly
from app.ml.shap_explain import explain_zone

router = APIRouter(prefix="/api/predict", tags=["Predict"])

class ZonePredictRequest(BaseModel):
    ndvi: float
    iron_index: float
    slope: float
    elevation: float
    lineament_density: float
    distance_to_deposit: float

class ZoneExplainRequest(BaseModel):
    ndvi: float = 0.4
    iron_index: float = 1.2
    slope: float = 12.0
    elevation: float = 450.0
    lineament_density: float = 0.5
    distance_to_deposit: float = 3.0

class ProductionPredictRequest(BaseModel):
    equipment_availability: float
    rainfall: float
    blast_delay: float
    ore_grade: float
    working_days: int = 30

class AnomalyDetectRequest(BaseModel):
    operating_hours: float
    temperature: float
    vibration: float
    maintenance_interval: float

@router.post("/zone")
def predict_zone_endpoint(req: ZonePredictRequest):
    return predict_zone(
        ndvi=req.ndvi,
        iron_index=req.iron_index,
        slope=req.slope,
        elevation=req.elevation,
        lineament_density=req.lineament_density,
        distance_to_deposit=req.distance_to_deposit
    )

@router.post("/explain")
def explain_zone_endpoint(req: ZoneExplainRequest):
    return explain_zone(req.model_dump())

@router.post("/production")
def predict_production_endpoint(req: ProductionPredictRequest):

    return predict_production(
        equipment_availability=req.equipment_availability,
        rainfall=req.rainfall,
        blast_delay=req.blast_delay,
        ore_grade=req.ore_grade,
        working_days=req.working_days
    )

@router.post("/anomaly")
def detect_anomaly_endpoint(req: AnomalyDetectRequest):
    return detect_anomaly(
        operating_hours=req.operating_hours,
        temperature=req.temperature,
        vibration=req.vibration,
        maintenance_interval=req.maintenance_interval
    )
