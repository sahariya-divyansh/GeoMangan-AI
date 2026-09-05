from app.db.base import SessionLocal
from app.db.models import Mine, ProspectivityZone, ForecastRecord, RecommendationRecord

MINES_DATA = [
    {"id": "mn-balaghat", "name": "Balaghat Mine", "state": "Madhya Pradesh", "lat": 21.8178, "lng": 80.1833, "monthly_target": 94000, "actual": 90250, "risk": "Medium"},
    {"id": "mn-ukwa",     "name": "Ukwa Mine",     "state": "Madhya Pradesh", "lat": 21.9716, "lng": 80.4662, "monthly_target": 38500, "actual": 41200, "risk": "Low"},
    {"id": "mn-tirodi",   "name": "Tirodi Mine",   "state": "Madhya Pradesh", "lat": 21.6854, "lng": 79.7225, "monthly_target": 46000, "actual": 43100, "risk": "Medium"},
    {"id": "mn-kandri",   "name": "Kandri Mine",   "state": "Maharashtra",    "lat": 21.3928, "lng": 79.3409, "monthly_target": 52500, "actual": 48180, "risk": "High"},
    {"id": "mn-munsar",   "name": "Munsar Mine",   "state": "Maharashtra",    "lat": 21.3871, "lng": 79.2886, "monthly_target": 61500, "actual": 63840, "risk": "Low"},
]

ZONES_DATA = [
    {"id": "pz-balaghat-east",    "mine_id": "mn-balaghat", "lat": 21.8239, "lng": 80.1974, "score": 86, "confidence": "High",   "ndvi": 0.34, "iron_index": 1.42, "action": "Prioritize infill drilling along eastern contact zone"},
    {"id": "pz-ukwa-north",       "mine_id": "mn-ukwa",     "lat": 21.9862, "lng": 80.4591, "score": 78, "confidence": "Medium", "ndvi": 0.41, "iron_index": 1.28, "action": "Run trench sampling before expanding bench plan"},
    {"id": "pz-tirodi-southwest", "mine_id": "mn-tirodi",   "lat": 21.6723, "lng": 79.7046, "score": 73, "confidence": "Medium", "ndvi": 0.29, "iron_index": 1.19, "action": "Validate anomaly with ground magnetic traverse"},
    {"id": "pz-kandri-west",      "mine_id": "mn-kandri",   "lat": 21.3975, "lng": 79.3268, "score": 91, "confidence": "High",   "ndvi": 0.22, "iron_index": 1.57, "action": "Schedule step-out drilling in low-vegetation corridor"},
    {"id": "pz-munsar-deeps",     "mine_id": "mn-munsar",   "lat": 21.3794, "lng": 79.3019, "score": 64, "confidence": "Low",    "ndvi": 0.48, "iron_index": 1.08, "action": "Reprocess historical assay logs before field mobilization"},
]

FORECASTS_DATA = [
    {"mine": "Balaghat Mine", "target": 94000, "d7": 21400, "d30": 91300, "d90": 278500, "risk": "Medium", "reason": "Ventilation downtime and haulage congestion may keep output below target."},
    {"mine": "Ukwa Mine",     "target": 38500, "d7": 9800,  "d30": 40700, "d90": 121400, "risk": "Low",    "reason": "Stable ore feed and improved grade control support target overrun."},
    {"mine": "Tirodi Mine",   "target": 46000, "d7": 10350, "d30": 43800, "d90": 132600, "risk": "Medium", "reason": "Monsoon-affected road availability is slowing dispatch cycles."},
    {"mine": "Kandri Mine",   "target": 52500, "d7": 10900, "d30": 48700, "d90": 145800, "risk": "High",   "reason": "Ore dilution and crusher maintenance are pressuring recovery rates."},
    {"mine": "Munsar Mine",   "target": 61500, "d7": 15100, "d30": 63200, "d90": 188900, "risk": "Low",    "reason": "Consistent bench sequencing and stockpile blending reduce variance."},
]

RECS_DATA = [
    {"id": "rec-kandri-crusher",  "mine": "Kandri Mine",   "severity": "High",   "title": "Advance crusher liner replacement",      "reason": "Throughput losses align with rising recirculating load and high dilution risk.", "recovery": "Recover 2,800 to 3,400 tonnes over the next 30 days.", "status": "Pending"},
    {"id": "rec-balaghat-haulage", "mine": "Balaghat Mine", "severity": "Medium", "title": "Stagger underground haulage windows",     "reason": "Peak shift congestion is reducing effective hoisting availability.",             "recovery": "Recover approximately 1,900 tonnes this month.",        "status": "Approved"},
    {"id": "rec-tirodi-dispatch",  "mine": "Tirodi Mine",   "severity": "Medium", "title": "Pre-position road maintenance crew",      "reason": "Wet haul roads are increasing dispatch cycle time after afternoon rainfall.",     "recovery": "Protect 1,200 tonnes of forecast monthly output.",      "status": "Rejected"},
]

def seed_db():
    db = SessionLocal()
    try:
        if db.query(Mine).count() == 0:
            for item in MINES_DATA:
                db.add(Mine(**item))
            db.commit()

        if db.query(ProspectivityZone).count() == 0:
            for item in ZONES_DATA:
                db.add(ProspectivityZone(**item))
            db.commit()

        if db.query(ForecastRecord).count() == 0:
            for item in FORECASTS_DATA:
                db.add(ForecastRecord(**item))
            db.commit()

        if db.query(RecommendationRecord).count() == 0:
            for item in RECS_DATA:
                db.add(RecommendationRecord(**item))
            db.commit()
    finally:
        db.close()
