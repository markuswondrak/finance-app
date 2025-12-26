# Tasks: Redesign table interface with Action Bar

**Feature Branch**: `020-table-action-bar`
**Spec**: [specs/020-table-action-bar/spec.md](spec.md)

## Implementation Strategy

- **Component First**: We will build the reusable `TableActionBar` component first, ensuring it handles the layout (responsive) and input events (Search, Filter).
- **Vertical Slices**: We will integrate the Action Bar into the "Fixed Costs" page first (complete with logic), then the "Special Costs" page.
- **Logic Handling**: Filtering logic will be implemented as computed properties within the page components to keep the `TableActionBar` purely presentational ("dumb").
- **Cleanup**: Removal of legacy buttons will happen immediately upon integration to avoid UI duplication.

## Dependencies

1. **Foundational**: `TableActionBar.vue` must be ready before page integration.
2. **Fixed Costs Integration**: Covers US1, US2, US3 for Fixed Costs.
3. **Special Costs Integration**: Covers US1, US2, US3 for Special Costs.
4. **Mobile Polish**: Final check on responsive behavior (US4).

## Phase 1: Setup

- [x] T001 Initialize feature branch and documentation (Done automatically) in specs/020-table-action-bar/tasks.md

## Phase 2: Foundational (Blocking)

- [x] T002 Create TableActionBar component structure with Search and Datepicker in frontend/src/components/common/TableActionBar.vue
- [x] T003 Implement responsive grid layout (stacking on mobile) for TableActionBar in frontend/src/components/common/TableActionBar.vue
- [x] T004 Define props (search, date) and slots (action) in frontend/src/components/common/TableActionBar.vue
- [x] T005 [P] Create unit test skeleton for TableActionBar in frontend/src/components/common/TableActionBar.spec.js

## Phase 3: Fixed Costs Integration (US1, US2, US3)

**Goal**: Enable Search, Year/Month Filter, and Action Button on Fixed Costs page.

- [x] T006 [US1] Import and place TableActionBar in frontend/src/components/fixedcosts/FixedCostsPage.vue
- [x] T007 [US1] Implement `searchQuery` and `selectedDate` state in frontend/src/components/fixedcosts/FixedCostsPage.vue
- [x] T008 [US1] Implement `filteredEntries` computed property with Search (Name/Desc) and Date (Overlap) logic in frontend/src/components/fixedcosts/FixedCostsPage.vue
- [x] T009 [US3] Move "Add New Cost" button into TableActionBar slot in frontend/src/components/fixedcosts/FixedCostsPage.vue
- [x] T010 [US3] Remove legacy "#actions" slot and button from frontend/src/components/fixedcosts/FixedCostTable.vue
- [x] T011 [US1] Bind filtered data to FixedCostTable entries prop in frontend/src/components/fixedcosts/FixedCostsPage.vue
- [x] T012 [P] [US1] Add unit tests for Fixed Cost filtering logic in frontend/src/components/fixedcosts/FixedCostsPage.spec.js

## Phase 4: Special Costs Integration (US1, US2, US3)

**Goal**: Enable Search, Year/Month Filter, and Action Button on Special Costs page.

- [x] T013 [US1] Import and place TableActionBar in frontend/src/components/SpecialCostsPage.vue
- [x] T014 [US1] Implement `searchQuery` and `selectedDate` state in frontend/src/components/SpecialCostsPage.vue
- [x] T015 [US2] Implement `filteredEntries` computed property with Search (Name) and Date (Exact Match) logic in frontend/src/components/SpecialCostsPage.vue
- [x] T016 [US3] Move "Add New Cost" button into TableActionBar slot in frontend/src/components/SpecialCostsPage.vue
- [x] T017 [US3] Remove legacy "#actions" slot and button usage in frontend/src/components/SpecialCostsPage.vue
- [x] T018 [P] [US1] Add unit tests for Special Cost filtering logic in frontend/src/components/SpecialCostsPage.spec.js

## Phase 5: Polish & Mobile (US4)

**Goal**: Ensure excellent UX on all devices.

- [x] T019 [US4] Verify and tweak responsive classes for TableActionBar.vue in frontend/src/components/common/TableActionBar.vue
- [x] T020 [US4] Ensure "Clear Filter" functionality works and resets views in TableActionBar.vue in frontend/src/components/common/TableActionBar.vue
- [x] T021 [US1] Run full suite of frontend tests to ensure no regressions in frontend/src/components/
