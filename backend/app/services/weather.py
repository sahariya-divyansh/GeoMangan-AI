import datetime
import httpx

async def fetch_weather(lat: float, lng: float) -> dict:
    end = datetime.date.today()
    start = end - datetime.timedelta(days=7)
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        "parameters": "PRECTOTCORR,T2M,RH2M",
        "community": "AG",
        "longitude": lng,
        "latitude": lat,
        "start": start.strftime("%Y%m%d"),
        "end": end.strftime("%Y%m%d"),
        "format": "JSON"
    }
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    daily = data["properties"]["parameter"]
    rainfall_raw = list(daily["PRECTOTCORR"].values())
    temp_raw = list(daily["T2M"].values())
    humidity_raw = list(daily["RH2M"].values())

    rainfall_values = [v for v in rainfall_raw if v != -999] or rainfall_raw
    temp_values = [v for v in temp_raw if v != -999] or temp_raw
    humidity_values = [v for v in humidity_raw if v != -999] or humidity_raw

    return {
        "avg_rainfall_mm": round(sum(rainfall_values) / len(rainfall_values), 2),
        "avg_temperature_c": round(sum(temp_values) / len(temp_values), 2),
        "avg_humidity_pct": round(sum(humidity_values) / len(humidity_values), 2),
        "days_fetched": len(rainfall_values),
        "source": "NASA POWER API"
    }
