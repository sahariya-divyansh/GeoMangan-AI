from sqlalchemy import Column, String, Integer, Float, ForeignKey
from app.db.base import Base

class Mine(Base):
    __tablename__ = "mines"
    id = Column(String, primary_key=True)
    name = Column(String)
    state = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    monthly_target = Column(Integer)
    actual = Column(Integer)
    risk = Column(String)

class ProspectivityZone(Base):
    __tablename__ = "prospectivity_zones"
    id = Column(String, primary_key=True)
    mine_id = Column(String, ForeignKey("mines.id"))
    lat = Column(Float)
    lng = Column(Float)
    score = Column(Integer)
    confidence = Column(String)
    ndvi = Column(Float)
    iron_index = Column(Float)
    action = Column(String)

class ForecastRecord(Base):
    __tablename__ = "forecast_records"
    id = Column(Integer, primary_key=True, autoincrement=True)
    mine = Column(String)
    target = Column(Integer)
    d7 = Column(Integer)
    d30 = Column(Integer)
    d90 = Column(Integer)
    risk = Column(String)
    reason = Column(String)

class RecommendationRecord(Base):
    __tablename__ = "recommendations"
    id = Column(String, primary_key=True)
    mine = Column(String)
    severity = Column(String)
    title = Column(String)
    reason = Column(String)
    recovery = Column(String)
    status = Column(String, default="Pending")
