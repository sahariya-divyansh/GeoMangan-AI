import numpy as np
from sklearn.ensemble import IsolationForest

np.random.seed(42)

def _train_anomaly_model():
    n_samples = 150
    n_anomalies = 15  # 10% anomalies
    n_normal = n_samples - n_anomalies

    # Normal equipment telemetry data
    normal_op_hours = np.random.normal(8.0, 1.5, n_normal).clip(1.0, 14.0)
    normal_temp = np.random.normal(75.0, 5.0, n_normal).clip(60.0, 90.0)
    normal_vib = np.random.normal(2.5, 0.4, n_normal).clip(1.0, 4.0)
    normal_maint = np.random.normal(250.0, 30.0, n_normal).clip(150.0, 350.0)

    X_normal = np.column_stack([
        normal_op_hours,
        normal_temp,
        normal_vib,
        normal_maint
    ])

    # Anomalous equipment telemetry data
    anomaly_op_hours = np.random.uniform(16.0, 24.0, n_anomalies)
    anomaly_temp = np.random.uniform(95.0, 120.0, n_anomalies)
    anomaly_vib = np.random.uniform(5.5, 10.0, n_anomalies)
    anomaly_maint = np.random.uniform(450.0, 600.0, n_anomalies)

    X_anomaly = np.column_stack([
        anomaly_op_hours,
        anomaly_temp,
        anomaly_vib,
        anomaly_maint
    ])

    X = np.vstack([X_normal, X_anomaly])

    iso = IsolationForest(contamination=0.10, random_state=42)
    iso.fit(X)
    return iso

_model = _train_anomaly_model()

def detect_anomaly(
    operating_hours: float,
    temperature: float,
    vibration: float,
    maintenance_interval: float
) -> dict:
    X_input = np.array([[
        operating_hours,
        temperature,
        vibration,
        maintenance_interval
    ]])

    pred = _model.predict(X_input)[0]  # 1 = normal, -1 = anomaly
    is_anomaly = bool(pred == -1)

    # Decision function value: lower/negative means more anomalous
    decision_val = _model.decision_function(X_input)[0]
    
    # Map decision function to a 0.0 to 1.0 risk score
    # decision_val is typically in range [-0.5, 0.5]
    raw_risk = 0.5 - decision_val
    risk_score = round(float(np.clip(raw_risk, 0.0, 1.0)), 3)

    return {
        "is_anomaly": is_anomaly,
        "risk_score": risk_score
    }
