# Tasks: Monthly Surplus Card with Sparkline

**Feature**: `006-surplus-card-sparkline`
**Status**: Completed

## Phase 1: Setup
> Goal: Ensure project environment is ready for implementation.

- [x] T001 Verify Go environment and dependencies
- [x] T002 Verify Node/npm environment and dependencies

## Phase 2: Foundational
> Goal: Establish backend endpoint structure and frontend service layer.

**Backend**
- [x] T003 [P] Create `SurplusStatistics` and `SurplusPoint` structs in `backend/internal/models/statistics.go` (or shared models)
- [x] T004 [P] Create `backend/internal/api/statistics_test.go` with initial test cases
- [x] T005 Create `GetSurplusStatistics` handler stub in `backend/internal/api/statistics.go`
- [x] T006 Register `GET /api/statistics/surplus` route in `backend/cmd/server/main.go`

**Frontend**
- [x] T007 [P] Create `frontend/src/services/statistics.js` with `getSurplusStatistics` function

## Phase 3: User Story 1 - View Real Monthly Surplus
> Goal: Calculate and display the current "safe-to-spend" monthly surplus.
> **Priority**: P1

**Backend Implementation**
- [x] T008 [US1] Implement "Monthly Income" calculation (positive FixedCosts) in `backend/internal/api/statistics.go`
- [x] T009 [US1] Implement "Monthly Expenses" calculation (negative FixedCosts, prorated) in `backend/internal/api/statistics.go`
- [x] T010 [US1] Implement `CurrentSurplus` logic combining Income - Expenses in `backend/internal/api/statistics.go`

**Frontend Implementation**
- [x] T011 [P] [US1] Create `frontend/tests/unit/components/dashboard/MonthlySurplusCard.spec.js`
- [x] T012 [US1] Create `MonthlySurplusCard.vue` in `frontend/src/components/dashboard/MonthlySurplusCard.vue` (Value display only)
- [x] T013 [US1] Integrate `MonthlySurplusCard` into `frontend/src/components/overview/Overview.vue` (Replacing placeholder)
- [x] T014 [US1] Style surplus value with conditional formatting (Mint Green/Coral) in `MonthlySurplusCard.vue`

## Phase 4: User Story 2 - View Surplus Trend via Sparkline
> Goal: Calculate historical trend and visualize it with a sparkline chart.
> **Priority**: P2

**Backend Implementation**
- [x] T015 [US2] Implement loop to calculate surplus for past 6 months in `backend/internal/api/statistics.go`
- [x] T016 [US2] Populate `history` array in API response in `backend/internal/api/statistics.go`

**Frontend Implementation**
- [x] T017 [US2] Update `MonthlySurplusCard.vue` to render `Line` chart using `vue-chartjs`
- [x] T018 [US2] Configure Chart.js options for "Sparkline" look (hidden axes/legend) in `MonthlySurplusCard.vue`
- [x] T019 [US2] Map API history data to chart dataset in `MonthlySurplusCard.vue`

## Phase 5: User Story 3 - Understand True Disposable Income & Polish
> Goal: Ensure clarity, correct styling, and handle edge cases.
> **Priority**: P3

- [x] T020 [US3] Add "Monthly Surplus" label and context tooltip (if applicable) in `MonthlySurplusCard.vue`
- [x] T021 [US3] Ensure `rounded="xl"` is applied to the card in `MonthlySurplusCard.vue` (NFR-001)
- [x] T022 [US3] Verify color schema adherence (NFR-002) in `MonthlySurplusCard.vue`
- [x] T023 [US3] Handle loading state (skeleton loader) in `MonthlySurplusCard.vue` or parent
- [x] T024 [US3] Handle empty/zero data edge cases in `backend/internal/api/statistics.go` and Frontend

## Dependencies

1. Phase 2 (Foundational) MUST be completed before Phase 3.
2. Phase 3 (US1 - Value) is the MVP.
3. Phase 4 (US2 - Chart) depends on Phase 3 completion.

## Implementation Strategy

- **Backend First**: Implement the logic to derive income/expenses from existing FixedCosts. This is the core complexity.
- **Frontend TDD**: Write tests for the card component to ensure it handles positive/negative values correctly before styling.
- **Chart Integration**: Reuse patterns from `ForecastChart.vue` but simplify for sparkline.
