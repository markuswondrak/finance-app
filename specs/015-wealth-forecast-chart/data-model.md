# Data Model: Wealth Forecast Chart

**Feature**: `015-wealth-forecast-chart`

## Entities

### ForecastPoint
*Transient entity for chart data points*

| Field | Type | Description |
| :--- | :--- | :--- |
| `year` | `int` | The future year (e.g., 2026, 2027) |
| `invested` | `float64` | Total capital invested (Start + Monthly * Months) |
| `worst` | `float64` | Projected wealth (Worst Case Rate) |
| `average` | `float64` | Projected wealth (Average Case Rate) |
| `best` | `float64` | Projected wealth (Best Case Rate) |

### ForecastResponse
*API Response Object*

| Field | Type | Description |
| :--- | :--- | :--- |
| `points` | `[]ForecastPoint` | List of yearly data points |
| `start_capital` | `float64` | The initial capital used |
| `monthly_saving` | `float64` | The aggregated monthly saving used |
| `duration_years` | `int` | The duration used |

## Relationships

- `WealthForecastService` reads `WealthProfile` and `FixedCost` (where `is_saving=true`) to generate `ForecastPoint`s.
- No database persistence for `ForecastPoint` (calculated on-the-fly).
