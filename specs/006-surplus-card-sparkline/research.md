# Research: Monthly Surplus Card with Sparkline

**Feature**: `006-surplus-card-sparkline`
**Status**: Completed

## 1. Data Source for Monthly Income & Surplus History

**Problem**: Need to determine "Monthly Income" and calculate "Surplus" trends for the past 6 months without explicit "Income" entity or transaction history.

**Findings**:
- `FixedCost` model exists with `Amount`, `From` (*YearMonth), and `To` (*YearMonth).
- `models.IsRelevant(yearMonth, cost.From, cost.To)` exists (used in `overview.go`).
- Income can be defined as `FixedCost` with positive `Amount`.
- Expenses are `FixedCost` with negative `Amount`.

**Decision**: 
- **Income**: Sum of all `FixedCost` where `Amount > 0` and `IsRelevant(currentMonth)`.
- **Surplus History**: For each of the past 6 months `m`:
  - Calculate `MonthlyIncome(m)` = Sum(Positive FixedCosts active in `m`)
  - Calculate `MonthlyExpenses(m)` = Sum(Negative FixedCosts active in `m`, prorated by `DueMonth` frequency)
  - `Surplus(m) = MonthlyIncome(m) + MonthlyExpenses(m)` (assuming expenses are negative)
  - Return array of `{ Month: string, Surplus: int }`.

**Rationale**: Leverages existing data structure and logic (`IsRelevant`) to provide historically accurate theoretical surplus based on cost validity periods.

## 2. Sparkline Implementation

**Problem**: Need to render a small trend chart ("sparkline") within the card.

**Findings**:
- Project uses `Chart.js` via `vue-chartjs`.
- Sparkline is effectively a Line chart with:
  - Hidden axes (`display: false`)
  - Hidden legend (`display: false`)
  - Minimal/No tooltips
  - Hidden points (or small points)
  - Smooth curves (`tension: 0.4`)

**Decision**: Use `vue-chartjs` `Line` component directly within `MonthlySurplusCard.vue` (or a small wrapper `Sparkline.vue` if likely to be reused, but YAGNI suggests direct embedding or minimal local component).
- **Configuration**:
  - `responsive: true`, `maintainAspectRatio: false`
  - Scales x/y `display: false`
  - `borderColor`: `white` (or accent color)
  - `borderWidth`: 2
  - `pointRadius`: 0 (hover: 3)

**Rationale**: Consistent with project technology stack (`004-forecast-chart-visual`). Avoids new dependencies.

## 3. API Design

**Problem**: Frontend needs the surplus data.

**Decision**: Create new endpoint `GET /api/statistics/surplus`.
- **Response**:
  ```json
  {
    "currentSurplus": 450,
    "history": [
        { "yearMonth": "2023-08", "surplus": 400 },
        { "yearMonth": "2023-09", "surplus": 420 },
        ...
    ]
  }
  ```

**Rationale**: Separation of concerns. Keeps `overview` endpoint focused on the forecast table.
