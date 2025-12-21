# Research: Wealth Forecast Table

**Status**: Complete
**Date**: 2025-12-21

## Key Decisions

### 1. Data Aggregation Strategy
- **Decision**: Perform aggregation on the Frontend.
- **Rationale**: The backend already sends the full monthly forecast data for the chart. Sending a separate request for yearly data or calculating it on the backend adds unnecessary API overhead. The frontend can easily filter/reduce the monthly array to get the December values for the table.
- **Alternatives Considered**:
  - *Backend Aggregation Endpoint*: Rejected to avoid API bloat and because the data volume is small (max ~600 data points for 50 years).

### 2. Table Styling & Component Library
- **Decision**: Use `v-table` inside a custom-styled `v-card` to match `OverviewTable.vue`.
- **Rationale**: The requirement is explicit about matching the "glass border" look. Using the existing CSS classes `glass`, `border`, `card-accent-primary` ensures consistency.
- **Reference**: `frontend/src/components/overview/OverviewTable.vue`

### 3. Chart-Table Interaction
- **Decision**: Use a shared reactive state or event bus (if needed) but primarily prop-drilling/events via the parent `WealthPage`.
- **Rationale**: The `WealthPage` holds the forecast data. It can coordinate the hover state. When a row is hovered in `WealthForecastTable`, it emits an event. `WealthPage` can then call a method on `WealthForecastChart` (via ref) to trigger the tooltip/highlight.

## Unknowns Resolved

- **Styling**: Confirmed to use existing utility classes.
- **Data Source**: Confirmed to use the same dataset as the Chart.
