# Tasks: Wealth Forecast Chart

**Feature**: Wealth Forecast Chart
**Status**: Pending
**Spec**: `specs/015-wealth-forecast-chart/spec.md`

## Phase 1: Setup
*Goal: Verify project readiness for implementation.*

- [x] T001 Verify `chart.js` and `vue-chartjs` dependencies in `frontend/package.json`

## Phase 2: Foundational
*Goal: Implement backend calculation logic and API endpoints. Blocking for User Stories.*

- [x] T002 Define `ForecastPoint` and `ForecastResponse` structs in `backend/internal/models/forecast.go`
- [x] T003 Implement `WealthForecastService` calculation logic in `backend/internal/services/wealth_forecast_service.go`
- [x] T004 [P] Create unit tests for `WealthForecastService` in `backend/internal/services/wealth_forecast_service_test.go`
- [x] T005 Implement `GetWealthForecast` handler in `backend/internal/api/wealth_forecast_handler.go`
- [x] T006 Register `GET /api/wealth/forecast` route in `backend/cmd/server/main.go`

## Phase 3: User Story 1 - View Wealth Forecast
*Goal: Display the wealth projection chart on the UI. (Priority: P1)*

- [x] T007 [US1] Update `wealthService` to fetch forecast data in `frontend/src/services/wealthService.js`
- [x] T008 [P] [US1] Create `WealthForecastChart` component scaffold in `frontend/src/components/dashboard/WealthForecastChart.vue`
- [x] T009 [US1] Implement chart data processing and rendering logic in `frontend/src/components/dashboard/WealthForecastChart.vue`
- [x] T010 [US1] Apply gradient styling to chart datasets in `frontend/src/components/dashboard/WealthForecastChart.vue`
- [x] T011 [US1] Add `WealthForecastChart` to `WealthOverviewPage` in `frontend/src/pages/WealthOverviewPage.vue`
- [x] T012 [US1] Implement default configuration handling (No Profile state) in `frontend/src/pages/WealthOverviewPage.vue`
- [x] T013 [P] [US1] Create unit tests for `WealthForecastChart` in `frontend/tests/components/dashboard/WealthForecastChart.spec.js`

## Phase 4: Polish & Cross-Cutting
*Goal: Ensure high-quality UX and code standards.*

- [x] T014 Verify chart responsiveness and dark mode colors in `frontend/src/components/dashboard/WealthForecastChart.vue`
- [x] T015 Run full backend test suite to ensure no regressions in `backend/tests`

## Dependencies

1. **Foundational** (T002-T006) must complete before **US1 Integration** (T011).
2. **US1 Component** (T008) can start parallel to **Foundational**.

## Implementation Strategy

1. **Backend First**: Implement the calculation engine and API. This is the "hard" logic.
2. **Frontend Component**: Build the chart component using mock data initially if needed, then switch to API.
3. **Integration**: Connect the page to the service.
