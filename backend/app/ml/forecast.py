import numpy as np
from sklearn.ensemble import RandomForestRegressor

np.random.seed(42)

def _train_forecast_model():
    n_samples = 200

    equipment_availability = np.random.uniform(0.5, 1.0, n_samples)
    rainfall = np.random.uniform(0.0, 100.0, n_samples)
    blast_delay = np.random.uniform(0.0, 10.0, n_samples)
    ore_grade = np.random.uniform(25.0, 55.0, n_samples)
    working_days = np.random.randint(15, 31, n_samples)

    base = working_days * 1500.0 * (ore_grade / 40.0)
    weather_factor = np.maximum(0.5, 1.0 - (rainfall / 150.0))
    blast_factor = np.maximum(0.6, 1.0 - (blast_delay / 20.0))

    production = base * equipment_availability * weather_factor * blast_factor
    noise = np.random.normal(0, 500, n_samples)
    y = np.maximum(0, production + noise)

    X = np.column_stack([
        equipment_availability,
        rainfall,
        blast_delay,
        ore_grade,
        working_days
    ])

    reg = RandomForestRegressor(n_estimators=50, random_state=42)
    reg.fit(X, y)
    return reg

_model = _train_forecast_model()

def predict_production(
    equipment_availability: float,
    rainfall: float,
    blast_delay: float,
    ore_grade: float,
    working_days: int
) -> dict:
    X_input = np.array([[
        equipment_availability,
        rainfall,
        blast_delay,
        ore_grade,
        working_days
    ]])

    predicted_val = float(_model.predict(X_input)[0])
    predicted = int(round(predicted_val))

    baseline_target = working_days * 1500

    # Risk evaluation
    if predicted < baseline_target * 0.75 or rainfall > 60.0 or equipment_availability < 0.65:
        risk = "High"
    elif predicted < baseline_target * 0.90 or blast_delay > 4.0:
        risk = "Medium"
    else:
        risk = "Low"

    # Primary reason logic
    if equipment_availability < 0.70:
        reason = "Low equipment availability disrupting haulage and excavation."
    elif rainfall > 40.0:
        reason = "Heavy rainfall causing pit water logging and haul road delays."
    elif blast_delay > 3.0:
        reason = "Excessive blasting delay slowing down daily bench development."
    elif ore_grade < 30.0:
        reason = "Sub-optimal ore grade impacting processed output yield."
    else:
        reason = "Stable operating conditions maintaining forecast targets."

    return {
        "predicted": predicted,
        "risk": risk,
        "reason": reason
    }
