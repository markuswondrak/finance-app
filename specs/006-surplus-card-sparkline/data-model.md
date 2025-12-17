# Data Model: Surplus Statistics

**Feature**: `006-surplus-card-sparkline`

## Entities (Derived)

### SurplusStatistics
Represents the calculated surplus data for the dashboard card. Not persisted directly, derived from `FixedCost`.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| CurrentSurplus | int | The calculated surplus for the current month. | |
| History | []SurplusPoint | Array of historical surplus values for the last 6 months. | Max 6 items |

### SurplusPoint
Represents a single data point in the surplus history.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| YearMonth | string | The month identifier (e.g., "2025-01"). | ISO 8601 YYYY-MM |
| Surplus | int | The calculated surplus for this specific month. | |

## Relationships

- `SurplusStatistics` is derived from `User` (implied context) and `FixedCost` entries.
