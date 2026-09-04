from fastapi import APIRouter
from app.schemas.exploration import ZoneSchema
from typing import List

router = APIRouter(prefix="/api/exploration", tags=["Exploration"])

ZONES = [
    ZoneSchema(id="pz-balaghat-east",    mine_id="mn-balaghat", lat=21.8239, lng=80.1974, score=86, confidence="High",   ndvi=0.34, iron_index=1.42, action="Prioritize infill drilling along eastern contact zone"),
    ZoneSchema(id="pz-ukwa-north",       mine_id="mn-ukwa",     lat=21.9862, lng=80.4591, score=78, confidence="Medium", ndvi=0.41, iron_index=1.28, action="Run trench sampling before expanding bench plan"),
    ZoneSchema(id="pz-tirodi-southwest", mine_id="mn-tirodi",   lat=21.6723, lng=79.7046, score=73, confidence="Medium", ndvi=0.29, iron_index=1.19, action="Validate anomaly with ground magnetic traverse"),
    ZoneSchema(id="pz-kandri-west",      mine_id="mn-kandri",   lat=21.3975, lng=79.3268, score=91, confidence="High",   ndvi=0.22, iron_index=1.57, action="Schedule step-out drilling in low-vegetation corridor"),
    ZoneSchema(id="pz-munsar-deeps",     mine_id="mn-munsar",   lat=21.3794, lng=79.3019, score=64, confidence="Low",    ndvi=0.48, iron_index=1.08, action="Reprocess historical assay logs before field mobilization"),
]

@router.get("/", response_model=List[ZoneSchema])
def get_zones():
    return ZONES

@router.get("/{zone_id}", response_model=ZoneSchema)
def get_zone(zone_id: str):
    for zone in ZONES:
        if zone.id == zone_id:
            return zone
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Zone not found")