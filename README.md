# GeoMangan-AI

## Intelligent Mining Decision-Support Platform

GeoMangan-AI is a geospatial and machine-learning platform designed to support mineral exploration, production planning, operational risk analysis, and corrective-action planning in manganese mining.

The platform combines geological information, drilling observations, satellite-derived environmental indicators, historical production data, equipment availability, weather conditions, and operational constraints into a unified decision-support system.

Its primary objective is to help mining teams answer four operational questions:

1. Where should exploration efforts be prioritised?
2. How much production can a mine realistically achieve?
3. Is a production shortfall likely to occur?
4. What actions could reduce the expected shortfall?

GeoMangan-AI is designed as an assistive system for geologists, mine planners, operations teams, and management. It does not replace geological validation, drilling, laboratory assays, mine-planning processes, or expert decision-making.

---

## Product Vision

Traditional mining decisions often require information to be collected from multiple sources such as geological surveys, drilling records, production reports, equipment logs, weather information, and operational schedules.

GeoMangan-AI brings these information sources into a common intelligence layer.

The platform follows a continuous operational workflow:

```text
Explore
   |
   v
Estimate
   |
   v
Schedule
   |
   v
Monitor
   |
   v
Correct
   |
   +----------------------+
                          |
                          v
                       Explore
```

This creates a closed decision-support loop in which exploration intelligence and production intelligence can be analysed together.

---

## Core Capabilities

### 1. Exploration Intelligence

The exploration module generates an AI-assisted prospectivity map for a mine area.

It combines available geological and geospatial indicators such as:

* Geological similarity
* Satellite spectral indicators
* Vegetation indices
* Surface environmental indicators
* Structural and lineament information
* Terrain and slope
* Distance from known mineralisation
* Existing drilling observations

The result is a prospectivity score for individual grid cells and exploration zones.

The output is intended to help prioritise where further investigation or drilling may be more valuable.

### 2. Production Forecasting

The production intelligence module estimates future production based on historical and operational information.

Potential model inputs include:

* Historical production
* Production targets
* Ore grade
* Equipment availability
* Equipment downtime
* Preventive maintenance
* Blasting delays
* Weather conditions
* Rainfall
* Soil moisture
* Working days
* Haulage capacity
* Stockpile conditions

The system can generate forecasts for multiple planning horizons, including short-term and medium-term horizons.

### 3. Production Risk Detection

GeoMangan-AI identifies mines where predicted production may fall below the expected target.

The system can classify operational risk and estimate:

* Expected production
* Target production
* Expected shortfall
* Risk level
* Primary contributing factors
* Secondary contributing factors
* Confidence or uncertainty

### 4. Explainable Diagnosis

Instead of presenting only a prediction, the system attempts to explain why the risk exists.

Possible contributing factors include:

* Equipment downtime
* Heavy rainfall
* Blasting delays
* Low equipment availability
* Reduced ore grade
* Labour constraints
* Haulage limitations
* Other operational conditions

Explainability is an important part of the platform because mining decisions should remain understandable and reviewable by domain experts.

### 5. Corrective-Action Recommendations

When a production risk is identified, the platform generates potential corrective actions.

Examples include:

* Reallocating standby equipment
* Adjusting blasting schedules
* Increasing preventive maintenance
* Changing production sequence
* Increasing haulage capacity
* Prioritising a higher-grade production face
* Adjusting shift allocation

Recommendations are presented as decision-support suggestions and require human review.

### 6. What-if Simulation

The platform provides a simulation layer that allows users to evaluate possible interventions before making operational decisions.

Example scenarios include:

```text
What happens if:
- one additional haul truck becomes available?
- equipment downtime is reduced?
- blasting is moved to another shift?
- rainfall increases?
- equipment is transferred between mines?
```

The simulator compares the baseline forecast with the simulated scenario and estimates the resulting production impact.

---

# System Architecture

GeoMangan-AI is designed as a modular full-stack application.

```text
                    GeoMangan-AI
                          |
        +-----------------+-----------------+
        |                 |                 |
        v                 v                 v
 Exploration       Production         Operational
 Intelligence      Intelligence       Intelligence
        |                 |                 |
        +-----------------+-----------------+
                          |
                          v
                  Risk & Diagnosis
                          |
                          v
              Recommendation Engine
                          |
                          v
                   What-if Engine
                          |
                          v
                   Web Dashboard
```

The prototype separates the presentation layer, API layer, data layer, machine-learning layer, and geospatial processing layer.

---

# Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Leaflet / React-Leaflet
* Recharts

## Backend

* Python
* FastAPI
* Pydantic
* Uvicorn

## Machine Learning

* Python
* pandas
* NumPy
* scikit-learn
* XGBoost
* SHAP

The prototype will begin with simpler and explainable models before introducing more complex architectures.

## Geospatial Processing

* GeoPandas
* Rasterio
* Shapely
* Leaflet
* OpenStreetMap-compatible map data

## Data Storage

The initial prototype can use:

* CSV files for demonstration datasets
* SQLite for lightweight application storage

The architecture can later be extended to:

* PostgreSQL
* PostGIS
* Object storage
* Data-lake architecture

## Development

* Git
* GitHub
* Python virtual environments
* npm
* ESLint
* Prettier

## Deployment

The prototype is designed to be deployable using low-cost or free infrastructure.

Possible deployment targets include:

* Vercel
* Render
* GitHub Pages
* Streamlit Community Cloud

Production deployment would require significantly stronger infrastructure, security controls, data governance, and operational integrations.

---

# High-Level Architecture

```text
                         Web Browser
                              |
                              v
                    React + TypeScript
                              |
                       REST API / HTTP
                              |
                              v
                         FastAPI
                              |
            +-----------------+----------------+
            |                 |                |
            v                 v                v
       Data Services      ML Services     Geo Services
            |                 |                |
            v                 v                v
        CSV / DB        scikit-learn       GeoPandas
                         XGBoost            Rasterio
                         SHAP               Shapely
            |                 |                |
            +-----------------+----------------+
                              |
                              v
                       Recommendation
                           Engine
                              |
                              v
                         Dashboard
```

---

# Prototype Data Model

The initial prototype uses synthetic data that follows the structure expected from a future production data source.

Example datasets include:

```text
data/
├── mines.csv
├── production.csv
├── equipment.csv
├── drill_samples.csv
└── satellite_features.csv
```

### mines.csv

```text
mine_id
mine_name
state
latitude
longitude
monthly_target_tonnes
```

### production.csv

```text
date
mine_id
target
actual
grade
downtime_hours
blast_delay_hours
```

### equipment.csv

```text
date
mine_id
equipment_type
available_hours
operating_hours
downtime_reason
```

### drill_samples.csv

```text
sample_id
mine_id
latitude
longitude
depth_m
mn_grade_percent
```

### satellite_features.csv

```text
grid_id
mine_id
ndvi
iron_index
swir_ratio
slope
lineament_density
```

The datasets are intentionally structured so that future real-world data sources can replace the prototype datasets with minimal architectural changes.

> **Note on Data Schema Integration:**
> The synthetic CSV files located in `data/synthetic/` (`mines.csv`, `production.csv`, `equipment.csv`, `drill_samples.csv`, and `satellite_features.csv`) define the standardized data schemas for real MOIL (Manganese Ore India Limited) data integration and operational pipeline onboarding.

---


# Exploration Model

The prototype exploration engine calculates a prospectivity score for each spatial grid cell.

A conceptual score is:

```text
P = wgG + wsS + wrR + wlL + wtT + wdD
```

Where:

```text
G = geological similarity
S = satellite spectral indicators
R = drilling evidence
L = structural / lineament information
T = terrain information
D = distance from known mineralisation
```

The initial prototype may use manually configured weights.

As validated historical data becomes available, these weights can be learned using supervised machine-learning models.

Potential models include:

* Random Forest
* XGBoost

The resulting output is a prospectivity classification such as:

```text
High Potential
Medium Potential
Low Potential
```

along with a confidence score.

---

# Production Forecasting

The first implementation will favour interpretable baseline models.

Potential approaches include:

* Random Forest
* Gradient Boosting
* XGBoost

More complex time-series architectures such as LSTM or Temporal Fusion Transformer can be considered after sufficient historical data becomes available.

The production model may use:

```text
Historical production
        +
Target
        +
Equipment availability
        +
Downtime
        +
Blasting delay
        +
Weather
        +
Ore grade
        |
        v
Production Forecast
```

The forecast is then compared against the production target.

```text
Expected Production < Target
             |
             v
       Shortfall Risk
```

---

# Risk Diagnosis

GeoMangan-AI combines model outputs with operational rules to identify potential causes.

Example logic:

```text
IF equipment_availability < threshold
    -> Equipment risk

IF rainfall > threshold
AND haulage_output decreases
    -> Weather-related risk

IF blasting_delay > planned_delay
    -> Blasting risk

IF predicted_grade < required_grade
    -> Grade risk
```

The prototype can later combine these rules with SHAP-based model explanations.

---

# Recommendation Engine

The recommendation layer converts identified risks into potential actions.

Example:

```text
Risk:
High shortfall probability

Cause:
Reduced haul-truck availability

Potential action:
Reallocate standby haul truck

Expected impact:
Increase predicted production

Approval:
Required from authorised operator
```

The recommendation engine is intentionally designed as a decision-support system rather than an autonomous operational controller.

---

# What-if Simulation

The simulator evaluates hypothetical operational changes.

Example:

```text
Baseline:

Target production:       10,000 tonnes
Predicted production:     8,900 tonnes
Expected shortfall:       1,100 tonnes
Risk:                      High
```

Scenario:

```text
Add one available haul truck
```

Simulated result:

```text
Predicted production:     9,650 tonnes
Expected shortfall:         350 tonnes
Recovered production:       750 tonnes
```

The numbers above are illustrative prototype outputs.

---

# Dashboard

The prototype dashboard is organised around operational decisions rather than individual algorithms.

Planned screens:

1. Overview Dashboard
2. Mine Details
3. Exploration Map
4. Production Forecast
5. Risk and Recommendations
6. What-if Simulator

### Overview Dashboard

Provides a high-level operational summary:

* Total mines
* Current production
* Target vs actual
* High-risk mines
* Exploration priority zones
* Production alerts

### Mine Details

Provides:

* Production trends
* Equipment availability
* Weather trends
* Ore-grade trends
* Risk factors
* Forecasts

### Exploration Map

Provides:

* Mine boundaries
* Drill locations
* Prospectivity heatmap
* Priority exploration zones
* Confidence information

### Production Forecast

Provides:

* Historical production
* Target production
* Predicted production
* Forecast horizon
* Confidence interval
* Shortfall classification

### Recommendation Panel

Provides:

* Identified risk
* Root cause
* Recommended action
* Expected impact
* Required resources
* Human approval state

### What-if Simulator

Provides:

* Scenario selection
* Parameter adjustment
* Recalculated forecast
* Baseline comparison
* Estimated recovered production

---

# Repository Structure

The planned repository structure is:

```text
GeoMangan-AI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── data/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── ml/
│   │   ├── geo/
│   │   ├── core/
│   │   └── main.py
│   ├── requirements.txt
│   └── README.md
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── synthetic/
│
├── notebooks/
│
├── models/
│
├── scripts/
│
├── tests/
│   ├── frontend/
│   └── backend/
│
├── docs/
│
├── .gitignore
├── LICENSE
└── README.md
```

The exact structure may evolve as implementation progresses.

---

# Development Philosophy

GeoMangan-AI follows several engineering principles.

## Modular Architecture

Each major capability should have a clear boundary.

Examples:

```text
exploration
forecasting
risk
recommendations
simulation
```

This allows individual components to be improved without rewriting the entire application.

## Explainability

Predictions should provide supporting information whenever possible.

The system should avoid presenting model output as unquestionable truth.

## Human-in-the-loop

Operational recommendations require human review.

The platform assists decision-making rather than automatically changing mine schedules or equipment assignments.

## Data Quality

Invalid or inconsistent records should be identified rather than silently incorporated into model training.

## Reproducibility

Models, datasets, preprocessing steps, and experiments should be reproducible.

## Separation of Concerns

Frontend presentation, backend APIs, data processing, machine-learning logic, and storage should remain separated.

---

# Prototype Limitations

The prototype does not represent a certified geological reserve estimation system.

Satellite imagery can provide useful surface and environmental indicators, but it cannot by itself certify an underground manganese reserve.

Actual reserve estimation requires validated geological information, drilling, laboratory assays, geological modelling, geostatistical estimation, recovery assumptions, and qualified expert review.

Therefore, GeoMangan-AI uses terminology such as:

* Prospectivity score
* Exploration priority
* Potential zone
* Model-estimated grade
* Confidence score

rather than presenting model output as a certified mineral reserve.

The prototype also uses synthetic operational data where real operational datasets are unavailable.

---

# Production Roadmap

## Phase 1 — Prototype

* Synthetic datasets
* Interactive dashboard
* Exploration prospectivity scoring
* Production forecasting
* Risk detection
* Explainable recommendations
* What-if simulation
* Local development environment

## Phase 2 — Pilot

* Real historical drilling data
* Real production data
* Equipment records
* Historical validation
* Geological expert review
* Model calibration
* Mine-specific evaluation

## Phase 3 — Multi-Mine Deployment

* Multiple mine integrations
* Secure data ingestion
* Equipment telemetry
* Automated alerts
* Role-based dashboards
* Production optimisation
* Centralised monitoring

## Phase 4 — Enterprise Platform

Potential capabilities include:

* 3D geological modelling
* Advanced geostatistics
* Hyperspectral data
* Geophysical data
* Real-time operational data
* ERP integration
* Mine-planning integration
* ML model lifecycle management
* Advanced optimisation
* Enterprise security
* Audit trails
* Government-approved infrastructure

---

# Evaluation

The platform should be evaluated using both technical and operational metrics.

## Exploration

Potential metrics:

* Precision of top-k exploration zones
* Percentage of known mineralised drill points inside high-score zones
* Grade prediction MAE
* Exploration-area reduction
* Successful targets identified

## Production

Potential metrics:

* MAE
* MAPE
* High-risk event recall
* False-alert rate
* Forecast performance across different horizons
* Target-achievement improvement

## Operational Impact

Potential metrics:

* Reduction in production shortfall
* Reduction in unplanned downtime
* Equipment utilisation
* Reduction in unnecessary exploration
* Planning-time reduction
* Improvement in ore recovery

---

# Data and Security Considerations

A production implementation would handle potentially sensitive geological, operational, and production information.

Production deployment should therefore consider:

* Role-based access control
* Authentication and authorisation
* Encryption
* Secure API communication
* Audit logging
* Data retention policies
* Backup and recovery
* Network security
* Infrastructure monitoring
* Data residency
* Government and organisational security requirements

The prototype does not claim to implement production-grade security controls.

---

# Development Status

Current stage:

```text
Repository
    |
    +-- Project initialisation
    |
    +-- Frontend
    |
    +-- Backend
    |
    +-- Data layer
    |
    +-- ML layer
    |
    +-- Geospatial layer
    |
    +-- Dashboard
    |
    +-- Integration
    |
    +-- Testing
    |
    +-- Deployment
```

Development is being performed incrementally, with individual features implemented, tested, and committed independently.

---

# Contributing

Contributions should follow the repository's development conventions.

Recommended workflow:

```text
Create branch
      |
      v
Implement feature
      |
      v
Run tests
      |
      v
Review changes
      |
      v
Commit
      |
      v
Push branch
      |
      v
Pull Request
```

Feature branches should use descriptive names such as:

```text
feature/exploration-map
feature/production-forecast
feature/risk-engine
feature/recommendation-engine
feature/what-if-simulator
```

---

# License

License information will be added as the project reaches its public release stage.

---

# Disclaimer

GeoMangan-AI is a software prototype and decision-support platform.

Its predictions, prospectivity scores, forecasts, and recommendations are model-generated outputs and should not be interpreted as certified geological reserves, guaranteed production forecasts, or autonomous operational instructions.

Real-world deployment requires validated data, domain-expert review, appropriate engineering validation, security controls, and integration with authorised mining systems.
