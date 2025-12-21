# Data Model: Wealth Forecast Table

## Frontend Entities

### ForecastTableData
*Transient entity derived from the main Forecast response.*

| Field | Type | Description |
|-------|------|-------------|
| `year` | `number` | The calendar year (e.g., 2025). |
| `totalInvested` | `number` | The cumulative invested amount at the end of this year. |
| `worstCase` | `number` | The projected value in the worst-case scenario. |
| `averageCase` | `number` | The projected value in the average-case scenario. |
| `bestCase` | `number` | The projected value in the best-case scenario. |
| `isHovered` | `boolean` | State indicating if this row is currently hovered (for chart sync). |

## Data Transformation

The raw forecast data (likely `ForecastMonth[]`) will be mapped to `ForecastTableData[]` using the following logic:

1. Group by `Year`.
2. Select the record for `Month == 12` (December) or the last available month for the partial final year.
3. Map fields:
   - `totalInvested` -> `totalInvested`
   - `worstCase` -> `valueConservative` (or equivalent backend field)
   - `averageCase` -> `valueAverage`
   - `bestCase` -> `valueOptimistic`
