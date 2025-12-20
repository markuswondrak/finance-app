# Tasks: Fixed Cost Savings

**Feature**: `013-fixed-cost-savings`
**Spec**: [specs/013-fixed-cost-savings/spec.md](../specs/013-fixed-cost-savings/spec.md)

## Implementation Strategy
- **Approach**: Full-stack incremental
- **MVP**: Enable "Mark as Saving" for Fixed Costs first, then Special Costs.
- **Testing**:
  - Backend: Unit tests for model updates and API validation.
  - Frontend: Unit/Component tests for the new 3-state selector logic.

## Dependencies

- **US1 (Flag Cost as Saving)** depends on Phase 2 (DB Schema + Backend Logic)

## Phase 1: Setup

- [x] T001 Create `IncomingSelect.vue` as a shared component (refactor if exists or create new) to support 3 states (Income, Expense, Saving) in `frontend/src/components/editform/IncomingSelect.vue`

## Phase 2: Foundational (Backend & Schema)

- [x] T002 Update `FixedCost` struct to include `IsSaving` field in `backend/internal/models/fixedcost.go`
- [x] T003 Update `SpecialCost` struct to include `IsSaving` field in `backend/internal/models/specialcost.go`
- [x] T004 Update `JsonFixedCost` struct to include `IsSaving` field in `backend/internal/api/fixedcosts.go`
- [x] T005 Update `ToDBStruct` and `ToJsonStruct` transformers for Fixed Costs to handle `IsSaving` in `backend/internal/api/fixedcosts.go`
- [x] T006 Implement validation logic in `backend/internal/api/fixedcosts.go` to reject requests where `Incoming` (implied by positive amount) and `IsSaving` are both true (or equivalent logic based on API contract)
- [x] T007 Update `SpecialCost` API handlers to accept and validate `IsSaving` in `backend/internal/api/specialcosts.go`
- [x] T008 [P] Add unit tests for Fixed Cost validation logic in `backend/internal/api/fixedcosts_test.go`
- [x] T009 [P] Add unit tests for Special Cost validation logic in `backend/internal/api/specialcosts_test.go`

## Phase 3: User Story 1 (Flag Cost as Saving)

**Goal**: Users can mark fixed and special costs as savings via the UI.
**Test Criteria**:
- Creating/Editing a cost allows selecting "Sparen".
- "Sparen" is mutually exclusive with "Einnahme".
- Saved costs show a piggy bank icon in the list.

### Frontend Implementation
- [x] T010 [US1] Update `monthlyCostToForm` and `baseFormToCost` in `frontend/src/components/Utils.js` to handle `is_saving` property mapping.
- [x] T011 [US1] Update `IncomingSelect.vue` (created in T001) to visually render the 3 states (Income/Expense/Saving) and emit correct values.
- [x] T012 [US1] Integrate updated `IncomingSelect` into `frontend/src/components/editform/MonthlyCostEditForm.vue`.
- [x] T013 [US1] Integrate updated `IncomingSelect` into `frontend/src/components/editform/SpecialCostForm.vue`.
- [x] T014 [US1] Update `frontend/src/components/FixedCostTable.vue` to display `mdi-piggy-bank` icon next to the name if `is_saving` is true.
- [x] T015 [US1] Update `frontend/src/components/SpecialCosts.vue` (or equivalent list component) to display `mdi-piggy-bank` icon next to the name if `is_saving` is true.

### Testing
- [x] T016 [US1] [P] Add unit test for `IncomingSelect` component behavior in `frontend/src/components/editform/__tests__/IncomingSelect.spec.js` (create if missing).
- [x] T017 [US1] [P] Update existing form tests to verify new "Saving" state persistence in `frontend/tests/unit/components/editform/MonthlyCostEditForm.spec.js`.

## Phase 4: Polish

- [x] T018 Verify "Piggy Bank" icon alignment and color in dark mode (Manual UI check).
- [x] T019 Ensure database migration ran successfully (implicit via GORM, verify logs).
