from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import mines, exploration, production, recommendations, whatif, predict, weather

app = FastAPI(
    title="GeoMangan-AI API",
    version="0.1.0",
    description="Reserve Intelligence and Production Continuity Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.db.init_db import init_db
from app.db.seed import seed_db

app.include_router(mines.router)
app.include_router(exploration.router)
app.include_router(production.router)
app.include_router(recommendations.router)
app.include_router(whatif.router)
app.include_router(predict.router)
app.include_router(weather.router)

@app.on_event("startup")
async def startup():
    init_db()
    seed_db()




@app.get("/")
def root():
    return {"status": "operational", "version": "0.1.0"}

@app.get("/health")
def health():
    return {"status": "ok"}