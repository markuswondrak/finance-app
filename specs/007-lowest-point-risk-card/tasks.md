# Tasks: Lowest Projected Point Card

**Branch**: `007-lowest-point-risk-card`
**Status**: Pending

## Phase 1: Setup
- [x] T001 Create component skeleton `frontend/src/components/dashboard/LowestPointCard.vue`
- [x] T002 Create test file `frontend/tests/unit/components/dashboard/LowestPointCard.spec.js` with basic import test

## Phase 2: User Story 1 (View Lowest Projected Balance)
**Goal**: Calculate and display the minimum projected balance from the forecast array.
**Independent Test**: Verify card correctly identifies the minimum value from a list of entries and displays it formatted as currency.

- [x] T003 [US1] Create test for `entries` prop validation and `lowestAmount` calculation in `frontend/tests/unit/components/dashboard/LowestPointCard.spec.js`
- [x] T004 [US1] Implement `entries` prop and `minEntry`/`lowestAmount` computed properties in `frontend/src/components/dashboard/LowestPointCard.vue`
- [x] T005 [US1] Create test for `formattedAmount` currency formatting in `frontend/tests/unit/components/dashboard/LowestPointCard.spec.js`
- [x] T006 [US1] Implement `formattedAmount` computed property and display value in template in `frontend/src/components/dashboard/LowestPointCard.vue`

## Phase 3: User Story 2 (Visual Warning)
**Goal**: Apply conditional styling (green/red) and alert icon based on risk level.
**Independent Test**: Verify correct classes and icons are applied for positive, negative, and zero values.

- [x] T007 [US2] Create test for `status` (pos/neg/neutral) and `variant` logic in `frontend/tests/unit/components/dashboard/LowestPointCard.spec.js`
- [x] T008 [US2] Implement `status` and `variant` computed properties in `frontend/src/components/dashboard/LowestPointCard.vue`
- [x] T009 [US2] Create test for CSS classes and alert icon visibility based on variant in `frontend/tests/unit/components/dashboard/LowestPointCard.spec.js`
- [x] T010 [US2] Implement dynamic CSS classes and conditional alert icon in template in `frontend/src/components/dashboard/LowestPointCard.vue`

## Phase 4: User Story 3 (Timing Context)
**Goal**: Display when the lowest point occurs (Month + Year).
**Independent Test**: Verify date is correctly formatted (e.g., "im August 2025") based on the identified minimum entry.

- [x] T011 [US3] Create test for `lowestDate` formatting (German locale) in `frontend/tests/unit/components/dashboard/LowestPointCard.spec.js`
- [x] T012 [US3] Implement `lowestDate` computed property using `Intl.DateTimeFormat` and display in template in `frontend/src/components/dashboard/LowestPointCard.vue`

## Phase 5: Integration & Polish
**Goal**: Integrate the card into the main dashboard layout.
**Independent Test**: Verify `Overview.vue` renders `LowestPointCard` in the correct slot with correct props.

- [x] T013 [P] Create integration test/snapshot for `Overview.vue` layout changes in `frontend/tests/unit/components/overview/Overview.spec.js`
- [x] T014 Update `frontend/src/components/overview/Overview.vue` to import `LowestPointCard`, remove generic `KPICard`, and rearrange layout (Balance -> Surplus -> Lowest Point)
- [x] T015 Verify final layout and responsiveness by running `pnpm dev` and checking browser output

## Dependencies

1. **Setup**: T001, T002 must complete first.
2. **US1**: T003 -> T004 -> T005 -> T006.
3. **US2**: Depends on US1 (T006). T007 -> T008 -> T009 -> T010.
4. **US3**: Depends on US1 (T006). T011 -> T012.
5. **Integration**: Depends on US1, US2, US3. T013, T014.

## Parallel Execution Opportunities

- T013 (Integration Test) can be written while US2/US3 logic is being implemented.
- T015 (Manual Verification) is the final step.

## Implementation Strategy

1. **MVP (US1)**: Build the "dumb" calculation engine first to ensure the number is right.
2. **UX Layer (US2+US3)**: Add the visual warnings and context.
3. **Integration**: Place it in the dashboard last to minimize disruption to the main view during dev.
