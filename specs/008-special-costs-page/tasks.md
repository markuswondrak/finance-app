# Tasks: Special Costs Page Functionality

**Branch**: `008-special-costs-page`
**Status**: Pending

## Phase 1: Setup
- [x] T001 Create `frontend/src/services/specialcosts.js` with API call abstractions (get, save, delete)
- [x] T002 Create initial test file `frontend/tests/unit/components/SpecialCosts.spec.js`
- [x] T003 Create initial test file `frontend/tests/unit/components/editform/SpecialCostForm.spec.js`

## Phase 2: User Story 1 (View Future Special Costs)
**Goal**: Display future special costs in a table, formatted correctly.
**Independent Test**: Verify the table renders, filters past dates, and formats amounts/dates correctly.

- [x] T004 [US1] Create test for `SpecialCosts.vue` filtering logic (future dates only) in `frontend/tests/unit/components/SpecialCosts.spec.js`
- [x] T005 [US1] Create test for `SpecialCosts.vue` formatting logic (amount sign/color, date format) in `frontend/tests/unit/components/SpecialCosts.spec.js`
- [x] T006 [US1] Refactor `frontend/src/components/SpecialCosts.vue` to fetch data using service
- [x] T007 [US1] Implement filtering logic in `frontend/src/components/SpecialCosts.vue` to show only future/current month costs
- [x] T008 [US1] Implement table columns and formatting (currency, date) in `frontend/src/components/SpecialCosts.vue`

## Phase 3: User Story 2 (Add New Special Cost)
**Goal**: Add new cost via modal with Income/Expense toggle.
**Independent Test**: Verify modal opens, form validation works, toggle updates amount sign, and save persists data.

- [x] T009 [US2] Create test for `SpecialCostForm.vue` toggle logic (Expense -> Negative, Income -> Positive) in `frontend/tests/unit/components/editform/SpecialCostForm.spec.js`
- [x] T010 [US2] Create test for `SpecialCostForm.vue` validation (required fields) in `frontend/tests/unit/components/editform/SpecialCostForm.spec.js`
- [x] T011 [US2] Refactor `frontend/src/components/editform/SpecialCostForm.vue` to use Vuetify components and add Income/Expense toggle
- [x] T012 [US2] Implement form state transformation logic (displayAmount <-> backend amount) in `frontend/src/components/editform/SpecialCostForm.vue`
- [x] T013 [US2] Implement save action in `frontend/src/components/editform/SpecialCostForm.vue` using service
- [x] T014 [US2] Integrate `SpecialCostForm` into `SpecialCosts.vue` (open modal, refresh list on save)

## Phase 4: Polish & Cross-Cutting
**Goal**: Ensure UI consistency and error handling.

- [x] T015 Verify error handling for API failures (show snackbar/alert) in `SpecialCosts.vue`
- [x] T016 Verify responsiveness of table and modal on mobile
- [x] T017 [P] Manual verification: Start app and test full flow (View -> Add -> Verify List)

## Dependencies

1. **Setup**: T001-T003 must be done first.
2. **US1**: T004-T008 depend on Setup.
3. **US2**: T009-T014 depend on Setup and ideally US1 (for list refresh).
4. **Polish**: T015-T017 done last.

## Parallel Execution Opportunities

- US1 (View) and US2 (Add) are largely independent component work and can be developed in parallel after Setup.
- Unit tests (T004, T005, T009, T010) can be written before implementation.

## Implementation Strategy

1. **MVP (US1)**: Get the read-only view working correctly first (fetching and displaying data).
2. **Interaction (US2)**: Build the form and write capability.
3. **Refinement**: Polish UX and error states.
