# Research: Wealth Forecast Chart

**Feature**: `015-wealth-forecast-chart`
**Status**: Phase 0 Complete

## Unknowns & Resolutions

### 1. Backend Data Structures
- **Question**: Where are `WealthProfile` and `FixedCosts` defined?
- **Finding**: 
  - `WealthProfile` is in `backend/internal/models/wealth_profile.go`.
  - `FixedCost` is in `backend/internal/models/fixedcost.go`.
- **Decision**: Import these models in the new service.

### 2. Forecast Calculation Logic
- **Question**: Does forecast logic exist?
- **Finding**: `backend/internal/api/overview.go` has `createOverview` which calculates a 30-month forecast. It uses `createRelevantMap` to handle `FixedCost` relevance per month.
- **Decision**: 
  - Refactor `createRelevantMap` logic into a reusable helper or duplication (for simplicity per "Simplicity First" if refactoring is risky) inside a new `WealthForecastService`.
  - Create `WealthForecastService` in `backend/internal/services/` to handle the specific compound interest calculation for `ForecastDurationYears`.

### 3. Frontend Chart Implementation
- **Question**: How is the "gradient styling" implemented?
- **Finding**: `frontend/src/components/dashboard/ForecastChart.vue` uses `vue-chartjs` with `chart.js` `Filler` plugin. It defines `createPositiveGradient` and `createNegativeGradient`.
- **Decision**: 
  - Create `WealthForecastChart.vue`.
  - Adapt the gradient functions to support 3 distinct colors (Green, Red, Theme-Average) instead of just Positive/Negative.
  - Use `Chart.js` dataset configuration to set `fill: true` (or `fill: 'origin'`) with the gradient function.

## Technology Decisions

| Area | Choice | Rationale |
| :--- | :--- | :--- |
| **Backend Service** | New `WealthForecastService` | Separates wealth forecasting logic from the generic dashboard overview logic. |
| **Chart Library** | `vue-chartjs` (Chart.js) | Standard library for the project. |
| **Styling** | Custom Canvas Gradients | Matches existing "Neon" aesthetic of the application. |
| **API** | `GET /api/wealth/forecast` | RESTful standard, resource-oriented. |

## Alternatives Considered

- **Reuse `ForecastChart.vue`**: Rejected because the existing chart is specialized for "Surplus" (positive/negative split), whereas the Wealth Chart needs 4 specific series with different semantic meanings (Invested vs Best vs Worst).
- **Client-side Calculation**: Rejected to keep business logic in Backend (Go) per Constitution "Full-Stack Separation". Frontend should only present data.
