# Tasks: Wealth Overview Redesign

**Feature Branch**: `018-wealth-overview-redesign`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Phase 1: Setup
*Goal: Prepare the environment for the redesign.*

- [x] T001 Verify project build state and existing tests pass (frontend)
- [x] T002 Verify backend is running and serving wealth data correctly

## Phase 2: Foundational
*Goal: Prepare shared components for the new design.*

- [x] T003 Rename `frontend/src/components/overview/KPICard.vue` to `BaseHighlightCard.vue`, move it to `frontend/src/components/common/`, and update all existing references
- [x] T004 [P] Refactor `BaseHighlightCard.vue` in `frontend/src/components/common/BaseHighlightCard.vue` to support a `footer` slot and emit `click` events
- [x] T005 [P] Update `BaseHighlightCard.vue` in `frontend/src/components/common/BaseHighlightCard.vue` to accept new props for "insight" text if not using a slot, ensuring backward compatibility
- [x] T006 Create unit tests for refactored `BaseHighlightCard` in `frontend/tests/unit/components/common/BaseHighlightCard.spec.js`

## Phase 3: View Wealth Insights (User Story 1)
*Goal: Replace the configuration panel with 3 read-only highlight cards displaying wealth insights.*

- [x] T007 [US1] Remove `WealthConfigPanel` usage from `frontend/src/components/wealth/WealthOverviewPage.vue`
- [x] T008 [P] [US1] Implement `CurrentWealthCard` component (or inline usage) in `frontend/src/components/wealth/WealthOverviewPage.vue` displaying `current_wealth`
- [x] T009 [P] [US1] Implement `TimeHorizonCard` component (or inline usage) in `frontend/src/components/wealth/WealthOverviewPage.vue` displaying `forecast_duration_years`
- [x] T010 [P] [US1] Implement `ExpectedReturnCard` component (or inline usage) in `frontend/src/components/wealth/WealthOverviewPage.vue` displaying `rate_average_case`
- [x] T011 [US1] Implement logic in `frontend/src/components/wealth/WealthOverviewPage.vue` to calculate "Next 100k" insight from forecast data
- [x] T012 [US1] Implement logic in `frontend/src/components/wealth/WealthOverviewPage.vue` to calculate "Portfolio at end date" insight
- [x] T013 [US1] Implement logic in `frontend/src/components/wealth/WealthOverviewPage.vue` to calculate "Spread (Worst/Best)" insight
- [x] T014 [US1] Layout the 3 cards in a responsive grid in `frontend/src/components/wealth/WealthOverviewPage.vue` matching Dashboard style
- [x] T015 [US1] Delete `frontend/src/components/wealth/WealthConfigPanel.vue` file

## Phase 4: Edit Wealth Configuration (User Story 2)
*Goal: Allow users to edit configuration parameters via modals linked to the highlight cards.*

- [x] T016 [P] [US2] Create `EditWealthModal.vue` in `frontend/src/components/wealth/EditWealthModal.vue` for editing `current_wealth`
- [x] T017 [P] [US2] Create `EditHorizonModal.vue` in `frontend/src/components/wealth/EditHorizonModal.vue` for editing `forecast_duration_years`
- [x] T018 [P] [US2] Create `EditReturnModal.vue` in `frontend/src/components/wealth/EditReturnModal.vue` for editing worst, average, and best case rates
- [x] T019 [US2] Integrate `EditWealthModal` into `WealthOverviewPage.vue` and trigger on "Current Wealth" card click
- [x] T020 [US2] Integrate `EditHorizonModal` into `WealthOverviewPage.vue` and trigger on "Time Horizon" card click
- [x] T021 [US2] Integrate `EditReturnModal` into `WealthOverviewPage.vue` and trigger on "Expected Return" card click
- [x] T022 [US2] Implement save logic in `WealthOverviewPage.vue` (or modals) to call `wealthService.updateProfile`
- [x] T023 [US2] Ensure forecast refresh is triggered upon successful save in `WealthOverviewPage.vue`
- [x] T024 [US2] Add global notification (snackbar) for success/error handling in `WealthOverviewPage.vue`

## Phase 5: Polish & Cross-Cutting
*Goal: Final UI adjustments and verification.*

- [x] T025 Ensure visual consistency (padding, margins, shadows) with Dashboard cards in `frontend/src/components/wealth/WealthOverviewPage.vue`
- [x] T026 Verify responsive behavior on mobile screens (cards should stack)
- [x] T027 Run full feature test suite (manual or automated)

## Implementation Strategy
- **MVP**: Complete Phase 2 and Phase 3 (View only).
- **Full Feature**: Complete Phase 4 (Edit capability).
- **Parallelization**: Modals (T016, T017, T018) can be built in parallel. Card implementations in Phase 3 can also be parallelized.

## Dependencies
- US2 depends on US1 (cards must exist to be clicked).
- All UI tasks depend on the `BaseHighlightCard` refactor (Phase 2).