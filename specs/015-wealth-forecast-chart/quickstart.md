# Quickstart: Wealth Forecast Chart

**Feature**: `015-wealth-forecast-chart`

## Prerequisites

- Backend running (`go run backend/main/main.go`)
- Frontend running (`pnpm dev` in `frontend/`)
- Database running with some Fixed Costs (mark one as saving) and a Wealth Profile.

## Verification Steps

1. **Verify Backend Calculation**:
   ```bash
   curl http://localhost:8082/api/wealth/forecast
   ```
   Should return JSON with `points` array.

2. **Verify Frontend**:
   - Navigate to `/wealth`.
   - Ensure the chart is visible.
   - Check for 4 lines: White (Invested), Red (Worst), Average (Theme), Green (Best).
   - Hover over points to see values.

3. **Verify Responsiveness**:
   - Change "Monthly Savings" in Fixed Costs.
   - Refresh `/wealth`.
   - Chart values should update.
