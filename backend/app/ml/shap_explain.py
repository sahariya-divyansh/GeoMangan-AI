import numpy as np
from app.ml.prospectivity import _model, FEATURE_NAMES

try:
    import shap
    explainer = shap.TreeExplainer(_model)
    HAS_SHAP = True
except ImportError:
    explainer = None
    HAS_SHAP = False

def explain_zone(features_dict: dict) -> list:
    input_values = [
        features_dict.get("ndvi", 0.4),
        features_dict.get("iron_index", 1.2),
        features_dict.get("slope", 12.0),
        features_dict.get("elevation", 450.0),
        features_dict.get("lineament_density", 0.5),
        features_dict.get("distance_to_deposit", 3.0),
    ]

    X_input = np.array([input_values])

    if HAS_SHAP and explainer is not None:
        shap_vals = explainer.shap_values(X_input)
        probs = _model.predict_proba(X_input)[0]
        pred_class_idx = int(np.argmax(probs))

        if isinstance(shap_vals, list):
            impacts = shap_vals[pred_class_idx][0]
        elif len(shap_vals.shape) == 3:
            impacts = shap_vals[0, :, pred_class_idx]
        else:
            impacts = shap_vals[0]
    else:
        impacts = _model.feature_importances_

    feature_impacts = []
    for name, val in zip(FEATURE_NAMES, impacts):
        feature_impacts.append({
            "feature": name,
            "impact": round(float(val), 4)
        })

    top_3 = sorted(feature_impacts, key=lambda x: abs(x["impact"]), reverse=True)[:3]
    return top_3
