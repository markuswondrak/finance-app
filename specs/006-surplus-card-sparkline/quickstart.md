# Quickstart: Monthly Surplus Card

## Integration

### Backend
1.  **Handler**: Implement `GetSurplusStatistics` in `backend/internal/api/statistics.go`.
    -   Inject `Repository` to access `FixedCost` data.
    -   Implement logic to sum positive vs negative fixed costs for `CurrentMonth` and `CurrentMonth - i` (i=1..5).
2.  **Route**: Register `GET /api/statistics/surplus` in `backend/cmd/server/main.go`.

### Frontend
1.  **Service**: Add `getSurplusStatistics` to `frontend/src/services/statistics.js` (create if needed).
2.  **Component**: Create `MonthlySurplusCard.vue`.
    -   Fetch data on mount.
    -   Display `currentSurplus` with `+` sign if positive.
    -   Render `Line` chart using `history` data.
3.  **Dashboard**: Add `MonthlySurplusCard` to `Overview.vue` (replacing the placeholder or 2nd KPI card).

## Verification

1.  **API Test**:
    ```bash
    curl http://localhost:8082/api/statistics/surplus
    ```
    Expect:
    ```json
    {"currentSurplus": 1200, "history": [{"yearMonth": "...", "surplus": 1100}, ...]}
    ```

2.  **Frontend**:
    -   Check if card appears.
    -   Check if sparkline renders.
    -   Check if numbers match expectations.
