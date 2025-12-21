# Quickstart: Wealth Forecast Table

## Prerequisites
- Backend running (`go run backend/main/main.go`)
- Frontend running (`pnpm dev` in `frontend/`)
- Existing forecast data available (via Wealth Profile)

## Implementation Steps

1. **Create Component**:
   - Create `frontend/src/components/wealth/WealthForecastTable.vue`.
   - Implement the `v-table` structure.
   - Apply `glass border card-accent-primary` classes.

2. **Implement Logic**:
   - Add props for `forecastData`.
   - Create a computed property to transform monthly data into yearly `ForecastTableData`.
   - Add `formatCurrency` utility usage.

3. **Integrate**:
   - Import `WealthForecastTable` in `frontend/src/pages/WealthPage.vue`.
   - Place it below `WealthForecastChart`.
   - Bind the forecast data.

4. **Add Interaction**:
   - Emit `row-hover` events from the table.
   - Handle events in `WealthPage` to trigger chart tooltips.

## Validation

### Manual Test
1. Navigate to `/wealth`.
2. Ensure the table appears below the chart.
3. Verify the number of rows matches the forecast years.
4. Hover a row and check if the chart highlights the corresponding year.

### Unit Tests
- `WealthForecastTable.spec.js`:
  - Test data transformation (Monthly -> Yearly).
  - Test empty state (Skeleton loader).
  - Test event emission on hover.
