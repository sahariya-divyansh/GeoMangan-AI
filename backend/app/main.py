from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import mines, exploration, production, recommendations, whatif

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

app.include_router(mines.router)
app.include_router(exploration.router)
app.include_router(production.router)
app.include_router(recommendations.router)
app.include_router(whatif.router)

@app.get("/")
def root():
    return {"status": "operational", "version": "0.1.0"}

@app.get("/health")
def health():
    return {"status": "ok"}