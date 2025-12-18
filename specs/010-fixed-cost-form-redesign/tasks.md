# Tasks: Fixed Cost Form Redesign

**Feature Branch**: `010-fixed-cost-form-redesign`
**Feature Spec**: [specs/010-fixed-cost-form-redesign/spec.md](spec.md)
**Implementation Plan**: [specs/010-fixed-cost-form-redesign/plan.md](plan.md)

## Phase 1: Setup & Analysis

**Goal**: Analyze existing components to prepare for standardization and notification implementation.

- [x] T001 Analyze `SpecialCostForm.vue` styling and `IncomingSelect.vue` usage to establish the target design pattern.
- [x] T002 Analyze `FixedCosts.vue` parent component to determine where to place the `v-snackbar` and how to handle updates.
- [x] T003 Analyze current table update logic in `FixedCosts.vue` and child components (monthly, quarterly, etc.) to plan the "no-reload" update strategy.

## Phase 2: Foundational Components (P1)

**Goal**: Establish the notification infrastructure and parent component state handling.

**Independent Test**: Parent component displays a snackbar when triggered and handles data updates without reload.

- [x] T004 Implement `v-snackbar` state and display logic in `frontend/src/components/FixedCosts.vue`.
- [x] T005 [P] Create a reusable method or handler in `FixedCosts.vue` to process "saved" events (update local list + show snackbar).

## Phase 3: Monthly Cost Form (P1)

**Goal**: Redesign the Monthly Cost form and integrate feedback loop.

**User Story**: US1 (Unified Form Design), US2 (Seamless Data Entry)
**Independent Test**: Monthly form matches Special Cost style, uses toggle, and updates table immediately on save.

- [x] T006 [US1] Update `frontend/src/components/editform/MonthlyCostEditForm.vue` template to use `v-card` with `rounded-xl` and standard padding matching Special Costs.
- [x] T007 [US1] Replace standard select/checkbox with `IncomingSelect.vue` component in `MonthlyCostEditForm.vue`.
- [x] T008 [US2] Update `saveCost` method in `MonthlyCostEditForm.vue` to emit `saved` event with data instead of reloading/redirecting.
- [x] T009 [US2] Update `frontend/src/components/FixedCosts.vue` (or relevant tab handler) to listen for `saved` event from Monthly form and trigger the handler created in Phase 2.
- [x] T010 [US1] Update unit tests `frontend/tests/unit/components/editform/MonthlyCostEditForm.spec.js` to verify new component structure and event emission.

## Phase 4: Quarterly Cost Form (P1)

**Goal**: Redesign the Quarterly Cost form and integrate feedback loop.

**User Story**: US1 (Unified Form Design), US2 (Seamless Data Entry)
**Independent Test**: Quarterly form matches Special Cost style, uses toggle, and updates table immediately on save.

- [x] T011 [P] [US1] Update `frontend/src/components/editform/QuaterlyCostEditForm.vue` template to use `v-card` with `rounded-xl` and standard padding.
- [x] T012 [P] [US1] Replace standard select/checkbox with `IncomingSelect.vue` component in `QuaterlyCostEditForm.vue`.
- [x] T013 [P] [US2] Update `saveCost` method in `QuaterlyCostEditForm.vue` to emit `saved` event with data.
- [x] T014 [US2] Update `frontend/src/components/FixedCosts.vue` to listen for `saved` event from Quarterly form.
- [x] T015 [US1] Update unit tests `frontend/tests/unit/components/editform/QuaterlyCostEditForm.spec.js` to verify new component structure and event emission.

## Phase 5: Half-Yearly Cost Form (P1)

**Goal**: Redesign the Half-Yearly Cost form and integrate feedback loop.

**User Story**: US1 (Unified Form Design), US2 (Seamless Data Entry)
**Independent Test**: Half-Yearly form matches Special Cost style, uses toggle, and updates table immediately on save.

- [x] T016 [P] [US1] Update `frontend/src/components/editform/HalfyearlyCostEditForm.vue` template to use `v-card` with `rounded-xl` and standard padding.
- [x] T017 [P] [US1] Replace standard select/checkbox with `IncomingSelect.vue` component in `HalfyearlyCostEditForm.vue`.
- [x] T018 [P] [US2] Update `saveCost` method in `HalfyearlyCostEditForm.vue` to emit `saved` event with data.
- [x] T019 [US2] Update `frontend/src/components/FixedCosts.vue` to listen for `saved` event from Half-Yearly form.
- [x] T020 [US1] Update unit tests `frontend/tests/unit/components/editform/HalfyearlyCostEditForm.spec.js` to verify new component structure and event emission.

## Phase 6: Yearly Cost Form (P1)

**Goal**: Redesign the Yearly Cost form and integrate feedback loop.

**User Story**: US1 (Unified Form Design), US2 (Seamless Data Entry)
**Independent Test**: Yearly form matches Special Cost style, uses toggle, and updates table immediately on save.

- [x] T021 [P] [US1] Update `frontend/src/components/editform/YearlyCostEditForm.vue` template to use `v-card` with `rounded-xl` and standard padding.
- [x] T022 [P] [US1] Replace standard select/checkbox with `IncomingSelect.vue` component in `YearlyCostEditForm.vue`.
- [x] T023 [P] [US2] Update `saveCost` method in `YearlyCostEditForm.vue` to emit `saved` event with data.
- [x] T024 [US2] Update `frontend/src/components/FixedCosts.vue` to listen for `saved` event from Yearly form.
- [x] T025 [US1] Update unit tests `frontend/tests/unit/components/editform/YearlyCostEditForm.spec.js` to verify new component structure and event emission.

## Phase 7: Polish & Validation

**Goal**: Ensure consistency across all forms and verify seamless updates.

- [x] T026 Verify all forms close immediately upon save (modal behavior).
- [x] T027 Verify success notification appears for all 4 form types.
- [x] T028 Verify table updates reflect changes without full page reload.
- [x] T029 Run full frontend test suite to ensure no regressions.

## Dependencies

- Phase 2 (Foundation) MUST complete before Phase 3-6 (Form implementations).
- Phases 3, 4, 5, 6 can be executed in parallel (independent components).
- T001-T003 (Analysis) are prerequisites for Phase 2.

## Implementation Strategy

1. **Analysis**: Understand the target style (`SpecialCostForm`) and the parent container (`FixedCosts`).
2. **Foundation**: Build the "infrastructure" (snackbar + event handler) in the parent component first.
3. **Iterative Component Update**: Update one form (Monthly) fully to prove the pattern.
4. **Parallel Rollout**: Apply the proven pattern to Quarterly, Half-Yearly, and Yearly forms (can be done in parallel or sequentially).
5. **Verification**: Confirm the UX goals (immediate feedback, visual consistency).