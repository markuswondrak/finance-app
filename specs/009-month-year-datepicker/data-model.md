# Data Model: Month Year Datepicker

## Entities

### YearMonth (Existing)

Represents the core temporal unit of the application.

| Field | Type | Description |
|-------|------|-------------|
| Year  | int  | The year (e.g., 2025) |
| Month | int  | The month (1-12) |

**Storage Format**:
- Database: Custom String `"YYYY MM"` (e.g., `"2025 1"`).
- JSON: `{ "year": 2025, "month": 1 }`

## Frontend Transformations

To satisfy the UI requirement of a standard Datepicker behavior while maintaining backend compatibility:

1. **Component Model**: The `MonthYearDatepicker` component will accept and emit a JavaScript `Date` object (set to 1st of month) OR a string "YYYY-MM".
2. **Service Layer Adapter**:
   - **Outbound**: Converts `Date` -> `{ year: YYYY, month: M }` before sending to API.
   - **Inbound**: Converts `{ year: YYYY, month: M }` -> `Date` before passing to component.

## Constraints

- **FR-004 Compliance**: While the spec requests "Storage as standard Date", strictly migrating the legacy `"YYYY MM"` string column to SQL `DATE` is out of scope for a UI component feature to avoid massive data migration risks. The "First of Month" rule is enforced *logically* by the adapter layer (Day is always discarded/reset to 1).
