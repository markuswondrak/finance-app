# Data Model: Redesign table interface with Action Bar

## UI Entities

### Filter State
State maintained in `FixedCostsPage` and `SpecialCostsPage`.

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `searchQuery` | string | Text entered in the search bar | `""` |
| `selectedDate` | string (YYYY-MM) | Selected Month/Year from Datepicker | `null` (No filter) |

## Logic

### Search Logic (Common)
- Match if `searchQuery` is empty.
- Match if `cost.name` contains `searchQuery` (case-insensitive).
- Match if `cost.description` (if exists) contains `searchQuery` (case-insensitive).
- **Exclude** `amount` field from search.

### Fixed Cost Filtering (Time)
A fixed cost is included if `selectedDate` is `null` OR:
1. Parse `selectedDate` to `targetYear` and `targetMonth`.
2. `cost.from` is before or same as `targetYear-targetMonth`.
3. AND (`cost.to` is `null` OR `cost.to` is after or same as `targetYear-targetMonth`).

### Special Cost Filtering (Time)
A special cost is included if `selectedDate` is `null` OR:
1. Parse `selectedDate` to `targetYear` and `targetMonth`.
2. `cost.dueDate.year == targetYear` AND `cost.dueDate.month == targetMonth`.

## Component Interface: TableActionBar

### Props
- `search` (String): Two-way binding for search text.
- `date` (String): Two-way binding for selected date (YYYY-MM).
- `loading` (Boolean): Optional loading state indicator.

### Slots
- `default`: Content for the primary action button (Add New).