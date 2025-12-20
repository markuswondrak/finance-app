# Data Model

## Entities

### WealthProfile

Stores the configuration parameters for a user's wealth forecast.

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| `id` | UUID / Integer | PK | Unique identifier |
| `user_id` | Integer | FK, UNIQUE | Links to the User |
| `current_wealth` | Decimal(15, 2) | NOT NULL, >= 0 | Current total wealth |
| `forecast_duration_years` | Integer | NOT NULL, > 0 | Number of years to forecast |
| `rate_worst_case` | Decimal(5, 2) | NOT NULL | Annual return rate (worst case) |
| `rate_average_case` | Decimal(5, 2) | NOT NULL | Annual return rate (average case) |
| `rate_best_case` | Decimal(5, 2) | NOT NULL | Annual return rate (best case) |
| `created_at` | Timestamp | | Record creation time |
| `updated_at` | Timestamp | | Record update time |

## Relationships

- **User (1) ↔ (1) WealthProfile**: A user has exactly one wealth profile configuration.

## Validation Rules

- **Current Wealth**: Must be non-negative.
- **Duration**: Must be between 1 and 100 years.
- **Rates**: Must be between -20.00% and +100.00%.
- **Logical Consistency**: `rate_worst_case <= rate_average_case <= rate_best_case` (Recommended but not strictly enforced by DB, maybe app level).
