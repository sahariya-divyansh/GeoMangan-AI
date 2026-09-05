def diagnose(
    equipment_availability: float,
    rainfall_24h: float,
    blasting_delay: float,
    predicted_grade: float,
    target_grade: float,
    predicted: int,
    target: int
) -> dict:
    candidates = []

    # 1. Equipment downtime
    if equipment_availability < 0.85:
        contrib = round((0.85 - equipment_availability) * 100, 1)
        candidates.append(("Equipment downtime", contrib))

    # 2. Rainfall-related haulage reduction
    if rainfall_24h > 25:
        contrib = round((rainfall_24h - 25) / 25 * 50, 1)
        candidates.append(("Rainfall-related haulage reduction", contrib))

    # 3. Blasting schedule delay
    if blasting_delay > 1.0:
        contrib = round(blasting_delay * 5, 1)
        candidates.append(("Blasting schedule delay", contrib))

    # 4. Grade-quality risk
    if predicted_grade < target_grade:
        contrib = round((target_grade - predicted_grade) / target_grade * 30, 1)
        candidates.append(("Grade-quality risk", contrib))

    # Rank factors by contribution descending
    candidates.sort(key=lambda x: x[1], reverse=True)

    if candidates:
        primary_reason, primary_contrib = candidates[0]
        secondary_reason = candidates[1][0] if len(candidates) > 1 else None
        secondary_contrib = candidates[1][1] if len(candidates) > 1 else None
    else:
        primary_reason = "Normal operating parameters"
        primary_contrib = 0.0
        secondary_reason = None
        secondary_contrib = None

    # Calculate shortfall metrics
    shortfall_tonnes = max(0, target - predicted)
    shortfall_pct = max(0.0, (target - predicted) / target * 100) if target > 0 else 0.0
    shortfall_prob = round(min(95.0, shortfall_pct * 2.5), 1)

    # Action mapping
    if "Equipment" in primary_reason:
        action = "Reallocate standby equipment from nearest available mine"
    elif "Rainfall" in primary_reason:
        action = "Move blasting to pre-rain window and pre-position road crew"
    elif "Blasting" in primary_reason:
        action = "Reschedule blasting by one shift and notify drill crew"
    elif "Grade" in primary_reason:
        action = "Blend ore from stockpile to meet grade requirements"
    else:
        action = "Maintain standard monitoring and shift targets"

    return {
        "primary_reason": primary_reason,
        "primary_contribution": primary_contrib,
        "secondary_reason": secondary_reason,
        "secondary_contribution": secondary_contrib,
        "shortfall_probability": shortfall_prob,
        "shortfall_tonnes": shortfall_tonnes,
        "suggested_action": action
    }
