import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Set random seed for reproducibility
np.random.seed(42)

FEATURE_NAMES = [
    "ndvi",
    "iron_index",
    "slope",
    "elevation",
    "lineament_density",
    "distance_to_deposit"
]

def _train_prospectivity_model():
    n_samples = 100
    ndvi = np.random.uniform(0.1, 0.9, n_samples)
    iron_index = np.random.uniform(0.1, 1.0, n_samples)
    slope = np.random.uniform(0.0, 35.0, n_samples)
    elevation = np.random.uniform(200.0, 900.0, n_samples)
    lineament_density = np.random.uniform(0.0, 1.0, n_samples)
    distance_to_deposit = np.random.uniform(0.1, 12.0, n_samples)

    X = np.column_stack([
        ndvi,
        iron_index,
        slope,
        elevation,
        lineament_density,
        distance_to_deposit
    ])

    # Formula for raw synthetic prospectivity score
    raw_scores = (
        0.35 * iron_index +
        0.25 * lineament_density +
        0.20 * np.maximum(0, 1.0 - distance_to_deposit / 10.0) +
        0.10 * ndvi +
        0.10 * np.maximum(0, 1.0 - slope / 30.0)
    )

    # Classify based on score thresholds
    y = np.where(raw_scores > 0.7, "High", np.where(raw_scores > 0.4, "Medium", "Low"))

    clf = RandomForestClassifier(n_estimators=50, random_state=42)
    clf.fit(X, y)
    return clf

# Train on import
_model = _train_prospectivity_model()

def predict_zone(
    ndvi: float,
    iron_index: float,
    slope: float,
    elevation: float,
    lineament_density: float,
    distance_to_deposit: float
) -> dict:
    X_input = np.array([[
        ndvi,
        iron_index,
        slope,
        elevation,
        lineament_density,
        distance_to_deposit
    ]])

    raw_score = float(np.clip(
        0.35 * iron_index +
        0.25 * lineament_density +
        0.20 * max(0.0, 1.0 - distance_to_deposit / 10.0) +
        0.10 * ndvi +
        0.10 * max(0.0, 1.0 - slope / 30.0),
        0.0,
        1.0
    ))
    score = round(raw_score, 3)

    pred_confidence = str(_model.predict(X_input)[0])

    # Rank features by importance
    importances = _model.feature_importances_
    sorted_indices = np.argsort(importances)[::-1]
    top_features = [FEATURE_NAMES[i] for i in sorted_indices[:3]]

    return {
        "score": score,
        "confidence": pred_confidence,
        "top_features": top_features
    }
