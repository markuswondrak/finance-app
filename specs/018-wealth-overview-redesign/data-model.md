# Data Model: Wealth Overview Redesign

**Feature**: `018-wealth-overview-redesign`

## Entities

### WealthProfile
*Existing Entity - Configuration for the wealth forecast simulation.*

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Yes | Primary Key |
| `user_id` | Integer | Yes | Foreign Key to User |
| `current_wealth` | Decimal | Yes | Starting capital for the simulation. |
| `forecast_duration_years` | Integer | Yes | Duration of the forecast in years (1-100). |
| `rate_worst_case` | Decimal | Yes | Annual return rate (%) for worst case scenario. |
| `rate_average_case` | Decimal | Yes | Annual return rate (%) for average case scenario. |
| `rate_best_case` | Decimal | Yes | Annual return rate (%) for best case scenario. |

**Constraints**:
- `rate_worst_case <= rate_average_case <= rate_best_case`
- `forecast_duration_years > 0`
- `current_wealth >= 0`

## API Resources

### Wealth Profile Resource

- `GET /api/wealth-profile`: Retrieve the current user's profile.
- `PUT /api/wealth-profile`: Update the current user's profile.

### Wealth Forecast Resource

- `GET /api/wealth/forecast`: Retrieve the calculated forecast based on the current profile and other costs.
  - Returns:
    - `points`: Array of {Year, Invested, Worst, Average, Best}
    - `start_capital`: Decimal
    - `monthly_saving`: Decimal
    - `duration_years`: Integer
