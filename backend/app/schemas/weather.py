from pydantic import BaseModel

class WeatherResult(BaseModel):
    avg_rainfall_mm: float
    avg_temperature_c: float
    avg_humidity_pct: float
    days_fetched: int
    source: str
