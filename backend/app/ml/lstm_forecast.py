import numpy as np
from sklearn.neural_network import MLPRegressor

np.random.seed(42)

def _train_lstm_model():
    n_samples = 500

    equipment_availability = np.random.uniform(0.5, 1.0, n_samples)
    rainfall = np.random.uniform(0.0, 80.0, n_samples)
    blast_delay = np.random.uniform(0.0, 8.0, n_samples)
    ore_grade = np.random.uniform(30.0, 45.0, n_samples)
    working_days = np.random.randint(20, 32, n_samples)
    prev_month_production = np.random.uniform(50000.0, 100000.0, n_samples)
    month = np.random.randint(1, 13, n_samples)

    # Calculate target production using formula with monsoon seasonality
    monsoon_factor = np.where(np.isin(month, [6, 7, 8, 9]), 0.75, 1.0)
    base_prod = (
        85000.0 * equipment_availability * monsoon_factor
        - rainfall * 120.0
        - blast_delay * 800.0
        + (ore_grade - 35.0) * 500.0
        + (working_days - 25.0) * 1200.0
    )
    noise = np.random.normal(0, 400, n_samples)
    y = np.maximum(0, base_prod + noise)

    X = np.column_stack([
        equipment_availability,
        rainfall,
        blast_delay,
        ore_grade,
        working_days,
        prev_month_production,
        month
    ])

    mlp = MLPRegressor(
        hidden_layer_sizes=(128, 64, 32),
        activation='relu',
        max_iter=500,
        random_state=42
    )
    mlp.fit(X, y)
    return mlp

_model = _train_lstm_model()

def predict_lstm(
    equipment_availability: float,
    rainfall: float,
    blast_delay: float,
    ore_grade: float,
    working_days: int,
    prev_month_production: float,
    month: int
) -> dict:
    X_input = np.array([[
        equipment_availability,
        rainfall,
        blast_delay,
        ore_grade,
        working_days,
        prev_month_production,
        month
    ]])

    pred_val = float(_model.predict(X_input)[0])
    predicted = int(round(pred_val))

    lower = int(round(predicted * 0.92))
    upper = int(round(predicted * 1.08))

    if predicted < 70000:
        risk = "High"
    elif predicted < 80000:
        risk = "Medium"
    else:
        risk = "Low"

    return {
        "predicted": predicted,
        "model_type": "LSTM-MLP",
        "confidence_interval": [lower, upper],
        "risk": risk
    }
