from fastapi import APIRouter, HTTPException
from app.schemas.recommendations import RecommendationSchema
from typing import List

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

RECS = [
    RecommendationSchema(id="rec-kandri-crusher",  mine="Kandri Mine",   severity="High",   title="Advance crusher liner replacement",      reason="Throughput losses align with rising recirculating load and high dilution risk.", recovery="Recover 2,800 to 3,400 tonnes over the next 30 days.", status="Pending"),
    RecommendationSchema(id="rec-balaghat-haulage", mine="Balaghat Mine", severity="Medium", title="Stagger underground haulage windows",     reason="Peak shift congestion is reducing effective hoisting availability.",             recovery="Recover approximately 1,900 tonnes this month.",        status="Approved"),
    RecommendationSchema(id="rec-tirodi-dispatch",  mine="Tirodi Mine",   severity="Medium", title="Pre-position road maintenance crew",      reason="Wet haul roads are increasing dispatch cycle time after afternoon rainfall.",     recovery="Protect 1,200 tonnes of forecast monthly output.",      status="Rejected"),
]

@router.get("/", response_model=List[RecommendationSchema])
def get_recommendations():
    return RECS

@router.patch("/{rec_id}/decide", response_model=RecommendationSchema)
def decide(rec_id: str, status: str):
    for rec in RECS:
        if rec.id == rec_id:
            rec.status = status
            return rec
    raise HTTPException(status_code=404, detail="Recommendation not found")
    