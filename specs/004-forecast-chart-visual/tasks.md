# Tasks: Main Forecast Chart Enhancement

**Input**: Design documents from `/specs/004-forecast-chart-visual/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Test tasks are included to meet the 60% coverage requirement stated in plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app frontend**: `frontend/src/`, `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETE

**Purpose**: Prepare constants and helper functions needed by all user stories

- [x] T001 Define CHART_COLORS constant with positive/negative/neutral/zeroLine/text colors in frontend/src/components/dashboard/ForecastChart.vue
- [x] T002 Create createGradient helper function for gradient fill generation in frontend/src/components/dashboard/ForecastChart.vue
- [x] T003 Create getSegmentColor helper function for segment-based line coloring in frontend/src/components/dashboard/ForecastChart.vue

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETE

**Purpose**: Core chart configuration that MUST be complete before ANY user story visualization can work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Update chartOptions computed property to include scales configuration base in frontend/src/components/dashboard/ForecastChart.vue
- [x] T005 Configure x-axis scale with display: false for grid lines in frontend/src/components/dashboard/ForecastChart.vue
- [x] T006 Configure y-axis scale with ticks color (white) and callback for currency formatting in frontend/src/components/dashboard/ForecastChart.vue

**Checkpoint**: Foundation ready - user story implementation can now begin ✅

---

## Phase 3: User Story 1 - Color-Coded Financial Health Visualization (Priority: P1) 🎯 MVP ✅ COMPLETE

**Goal**: Display positive values in mint green and negative values in soft coral so users can instantly identify financial health vs. risk periods

**Independent Test**: View chart with data that crosses zero and verify distinct colors are applied above and below the zero line

### Tests for User Story 1

- [x] T007 [P] [US1] Create test for positive values displaying in mint green color in frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- [x] T008 [P] [US1] Create test for negative values displaying in coral color in frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- [x] T009 [P] [US1] Create test for color transition at zero crossing point in frontend/tests/unit/components/dashboard/ForecastChart.spec.js

### Implementation for User Story 1

- [x] T010 [US1] Implement segment.borderColor callback to return positive/negative colors based on p1.parsed.y value in frontend/src/components/dashboard/ForecastChart.vue
- [x] T011 [US1] Implement pointBackgroundColor callback for data point markers matching segment colors in frontend/src/components/dashboard/ForecastChart.vue
- [x] T012 [US1] Configure dataset with segment styling in chartData computed property in frontend/src/components/dashboard/ForecastChart.vue

**Checkpoint**: At this point, positive/negative color coding should be fully functional and testable independently ✅

---

## Phase 4: User Story 2 - Gradient Fill for Visual Depth (Priority: P2) ✅ COMPLETE

**Goal**: Add gradient fill beneath the line that fades from solid color to transparent toward the zero line for visual depth

**Independent Test**: View chart and verify gradient fill appears beneath the line, fading from line color to transparent

### Tests for User Story 2

- [x] T013 [P] [US2] Create test for gradient fill presence with fill.target: 'origin' configuration in frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- [x] T014 [P] [US2] Create test for positive gradient (mint green) fill.above configuration in frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- [x] T015 [P] [US2] Create test for negative gradient (coral) fill.below configuration in frontend/tests/unit/components/dashboard/ForecastChart.spec.js

### Implementation for User Story 2

- [x] T016 [US2] Implement createPositiveGradient function using Canvas createLinearGradient API in frontend/src/components/dashboard/ForecastChart.vue
- [x] T017 [US2] Implement createNegativeGradient function using Canvas createLinearGradient API in frontend/src/components/dashboard/ForecastChart.vue
- [x] T018 [US2] Configure dataset fill object with target: 'origin', above: gradient, below: gradient in frontend/src/components/dashboard/ForecastChart.vue
- [x] T019 [US2] Add gradient recreation logic on chart resize using beforeDraw hook or scriptable backgroundColor in frontend/src/components/dashboard/ForecastChart.vue

**Checkpoint**: At this point, gradient fills should work independently with proper fade toward zero line ✅

---

## Phase 5: User Story 3 - Clean Chart with Prominent Data Line (Priority: P3) ✅ COMPLETE

**Goal**: Minimize grid lines and make the data line prominent with ~3px thickness and data point markers

**Independent Test**: View chart and verify minimal/no grid lines, thick visible data line, and data point markers

### Tests for User Story 3

- [x] T020 [P] [US3] Create test for grid lines being disabled or minimal in frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- [x] T021 [P] [US3] Create test for borderWidth: 3 on dataset configuration in frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- [x] T022 [P] [US3] Create test for pointRadius: 4 and pointHoverRadius: 6 on dataset in frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- [x] T023 [P] [US3] Create test for dashed zero reference line with correct color in frontend/tests/unit/components/dashboard/ForecastChart.spec.js

### Implementation for User Story 3

- [x] T024 [US3] Set borderWidth: 3 on dataset for prominent line thickness in frontend/src/components/dashboard/ForecastChart.vue
- [x] T025 [US3] Set pointRadius: 4 and pointHoverRadius: 6 for data point markers in frontend/src/components/dashboard/ForecastChart.vue
- [x] T026 [US3] Configure y-axis grid.display: false to remove grid lines in frontend/src/components/dashboard/ForecastChart.vue
- [x] T027 [US3] Implement y-axis grid.color callback to show dashed line only at zero value in frontend/src/components/dashboard/ForecastChart.vue
- [x] T028 [US3] Configure y-axis grid.borderDash callback to return [5, 5] only for zero line in frontend/src/components/dashboard/ForecastChart.vue
- [x] T029 [US3] Set tension: 0.3 for smooth curve rendering in frontend/src/components/dashboard/ForecastChart.vue

**Checkpoint**: All visual enhancements should now be complete with clean, prominent chart display ✅

---

## Phase 6: Polish & Cross-Cutting Concerns ✅ COMPLETE

**Purpose**: Validation, edge cases, and final verification

- [x] T030 [P] Create test for all-positive data scenario (entire chart in mint green) in frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- [x] T031 [P] Create test for all-negative data scenario (entire chart in coral) in frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- [x] T032 [P] Create test for edge case with values exactly at zero in frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- [x] T033 [P] Create test for chart with very few data points in frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- [x] T034 Run pnpm test:coverage and verify 60% minimum coverage achieved
- [x] T035 Visual verification: start dev server and validate all acceptance criteria from quickstart.md

---

## Phase 7: User Story 4 - Unified Dashboard Chart Experience (Priority: P0) ⚠️ CRITICAL ✅ COMPLETE

**Goal**: Replace OverviewChart with ForecastChart as the primary dashboard chart, removing legacy component entirely

**Independent Test**: Verify OverviewChart component no longer exists in codebase and ForecastChart is rendered in the dashboard overview

**⚠️ FR-000 REQUIREMENT**: The ForecastChart MUST completely replace OverviewChart; the legacy component MUST be removed

### Pre-Replacement Verification

- [x] T036 [US4] Verify ForecastChart is fully functional by running all tests (pnpm test:unit) before proceeding with replacement

### Implementation for User Story 4

- [x] T037 [US4] Update frontend/src/components/overview/Overview.vue to import and use ForecastChart instead of OverviewChart
- [x] T038 [US4] Remove frontend/src/components/overview/OverviewChart.vue from codebase
- [x] T039 [US4] Remove frontend/tests/unit/components/overview/OverviewChart.spec.js (if exists) from codebase
- [x] T040 [US4] Search codebase for any remaining OverviewChart references and remove them (imports, registrations, etc.)

### Post-Replacement Verification

- [x] T041 [US4] Run pnpm test:unit to verify no tests break after replacement
- [x] T042 [US4] Visual verification: start dev server and confirm ForecastChart displays correctly in dashboard overview
- [x] T043 [US4] Run grep -r "OverviewChart" frontend/src/ to confirm zero references remain

**Checkpoint**: Dashboard now uses unified ForecastChart component with no legacy OverviewChart remnants

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P3)
  - Or in parallel if different developers work on each
- **Polish (Phase 6)**: Depends on all user stories being complete
- **Component Replacement (Phase 7)**: Depends on Phase 6 completion - MUST be done last after ForecastChart is fully validated

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses CHART_COLORS from Setup, no US1 dependency
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses CHART_COLORS from Setup, no US1/US2 dependency
- **User Story 4 (P0)**: MUST wait until Phase 6 is complete - Replaces OverviewChart with validated ForecastChart

### Within Each User Story

- Tests SHOULD be written and FAIL before implementation
- Implementation follows the defined task order
- Story complete before moving to next priority (recommended) or parallel execution possible

### Parallel Opportunities

- All Setup tasks (T001-T003) are in the same file but can be done together as they define separate functions/constants
- All test tasks within a story marked [P] can run in parallel (different test cases in same file)
- Once Foundational phase completes, all user story implementations can start in parallel
- All Polish test tasks (T030-T033) can run in parallel

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all tests for User Story 1 together:
Task: "Create test for positive values displaying in mint green color"
Task: "Create test for negative values displaying in coral color"
Task: "Create test for color transition at zero crossing point"
```

## Parallel Example: User Story 3 Tests

```bash
# Launch all tests for User Story 3 together:
Task: "Create test for grid lines being disabled or minimal"
Task: "Create test for borderWidth: 3 on dataset configuration"
Task: "Create test for pointRadius: 4 and pointHoverRadius: 6 on dataset"
Task: "Create test for dashed zero reference line with correct color"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006)
3. Complete Phase 3: User Story 1 (T007-T012)
4. **STOP and VALIDATE**: Test color-coding works independently
5. Deploy/demo if ready - users can now distinguish positive/negative periods

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
   - Color-coded positive/negative visualization working
3. Add User Story 2 → Test independently → Deploy/Demo
   - Gradient fills add visual polish
4. Add User Story 3 → Test independently → Deploy/Demo
   - Clean chart with prominent line and zero reference
5. Each story adds value without breaking previous stories

### Single Developer Strategy

1. Complete Setup + Foundational
2. Work through user stories in priority order: P1 → P2 → P3
3. Run tests after each user story to verify independence
4. Complete Polish phase for edge cases and final validation

---

## Notes

- [P] tasks = different test cases or different logical units, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **Phases 1-6**: Implementation in single file: frontend/src/components/dashboard/ForecastChart.vue
- **Phase 7**: Multi-file changes (Overview.vue, removal of OverviewChart.vue and tests)
- All ForecastChart tests are in single file: frontend/tests/unit/components/dashboard/ForecastChart.spec.js
- Verify tests fail before implementing (TDD approach)
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
