# Tasks: Month Year Datepicker

**Feature Branch**: `009-month-year-datepicker`
**Status**: To Do
**Spec**: [spec.md](spec.md)

## Implementation Strategy

- **MVP**: Create the reusable `MonthYearDatepicker` component with unit tests.
- **Incremental Delivery**: Replace existing date inputs one by one, verifying data compatibility.
- **Parallelization**: Component implementation can proceed while another dev researches/updates integration points (though this is a single dev project, tasks are structured this way).

## Phase 1: Setup

*Goal: Initialize project structure and prerequisites.*

- [x] T001 Create component directory if missing in frontend/src/components/common
- [x] T002 Create test directory if missing in frontend/tests/components

## Phase 2: Foundational

*Goal: Core shared utilities and adapters.*

- [x] T003 Create date adapter utility in frontend/src/services/dateAdapter.js (converts between Date object and {year, month})

## Phase 3: User Story 1 - Select Forecast Period (P1)

*Goal: Implement the core Datepicker component that restricts input to Month/Year.*
*Independent Test: Component test verifies only Month/Year selection is possible.*

- [x] T004 [US1] Create component file frontend/src/components/common/MonthYearDatepicker.vue
- [x] T005 [US1] Implement Year Selector logic (prev/next/dropdown) in MonthYearDatepicker.vue
- [x] T006 [US1] Implement Month Grid logic (12 months) in MonthYearDatepicker.vue
- [x] T007 [US1] Implement Popover/Menu wrapping using v-menu in MonthYearDatepicker.vue
- [x] T008 [US1] Implement read-only input field triggering the menu in MonthYearDatepicker.vue
- [x] T009 [US1] Create unit test frontend/tests/components/MonthYearDatepicker.spec.js covering selection flow

## Phase 4: User Story 2 - Consistent Date Selection (P2)

*Goal: Replace existing inputs with the new component.*
*Independent Test: Navigate to forms and verify new component usage.*

- [x] T010 [P] [US2] Identify all forms using Year/Month input (grep search)
- [x] T011 [US2] Replace date input in "Add Fixed Cost" form with MonthYearDatepicker
- [x] T012 [US2] Replace date input in "Add Special Cost" form (if applicable) with MonthYearDatepicker
- [x] T013 [US2] Verify v-model binding works correctly with existing data structures using the adapter

## Final Phase: Polish & Cross-Cutting

- [x] T014 Ensure "Fintech Dark Mode" styling matches existing app (colors, fonts)
- [x] T015 Verify keyboard navigation and accessibility (tab order)
- [x] T016 Run full frontend test suite to ensure no regressions

## Dependencies

- Phase 3 depends on Phase 2
- Phase 4 depends on Phase 3
