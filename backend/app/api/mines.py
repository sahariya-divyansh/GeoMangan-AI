from fastapi import APIRouter
from app.schemas.mines import MineSchema
from typing import List

router = APIRouter(prefix="/api/mines", tags=["Mines"])

MINES = [
    MineSchema(id="mn-balaghat", name="Balaghat Mine", state="Madhya Pradesh", lat=21.8178, lng=80.1833, monthly_target=94000, actual=90250, risk="Medium"),
    MineSchema(id="mn-ukwa",     name="Ukwa Mine",     state="Madhya Pradesh", lat=21.9716, lng=80.4662, monthly_target=38500, actual=41200, risk="Low"),
    MineSchema(id="mn-tirodi",   name="Tirodi Mine",   state="Madhya Pradesh", lat=21.6854, lng=79.7225, monthly_target=46000, actual=43100, risk="Medium"),
    MineSchema(id="mn-kandri",   name="Kandri Mine",   state="Maharashtra",    lat=21.3928, lng=79.3409, monthly_target=52500, actual=48180, risk="High"),
    MineSchema(id="mn-munsar",   name="Munsar Mine",   state="Maharashtra",    lat=21.3871, lng=79.2886, monthly_target=61500, actual=63840, risk="Low"),
]

@router.get("/", response_model=List[MineSchema])
def get_mines():
    return MINES

@router.get("/{mine_id}", response_model=MineSchema)
def get_mine(mine_id: str):
    for mine in MINES:
        if mine.id == mine_id:
            return mine
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Mine not found")