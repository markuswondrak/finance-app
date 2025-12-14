# Tasks: Fintech Dark Mode Theme

**Input**: Design documents from `/specs/001-fintech-dark-theme/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Included per constitution (60% coverage requirement). Testing strategy: snapshot tests + unit tests + manual QA.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing setup and prepare for theme changes

- [X] T001 Verify project dependencies and Node.js version per quickstart.md
- [X] T002 [P] Review existing vuetify.js theme configuration in frontend/src/plugins/vuetify.js
- [X] T003 [P] Review existing finance.css structure in frontend/src/finance.css
- [X] T004 [P] Review OverviewChart.vue color implementation in frontend/src/components/overview/OverviewChart.vue

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core theme infrastructure that MUST be complete before ANY user story can be implemented

**Critical**: No user story work can begin until this phase is complete

- [X] T005 Update Vuetify theme with base dark colors (background: #121212, surface: #1E1E1E, surface-bright: #2A2A2A, surface-light: #333333, surface-variant: #424242) in frontend/src/plugins/vuetify.js
- [X] T006 Add financial indicator colors to Vuetify theme (positive: #4ADE80, negative: #F87171, neutral: #9CA3AF) in frontend/src/plugins/vuetify.js
- [X] T007 Add semantic color aliases (success: #4ADE80, error: #F87171, income: #4ADE80, expense: #F87171) in frontend/src/plugins/vuetify.js

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Modern Dark Visual Foundation (Priority: P1) MVP

**Goal**: Transform the application into a modern dark-themed interface with rounded corners and elevated cards

**Independent Test**: Launch the application and verify dark background, card surfaces with rounded corners, and proper elevation/shadows are visible across all screens

### Tests for User Story 1

- [X] T008 [P] [US1] Create snapshot test for vuetify theme configuration in frontend/tests/plugins/vuetify.test.js
- [X] T009 [P] [US1] Create unit test verifying theme colors are WCAG AA compliant in frontend/tests/plugins/theme-contrast.test.js

### Implementation for User Story 1

- [X] T010 [P] [US1] Apply rounded="xl" and elevation="4" to Overview.vue card in frontend/src/components/overview/Overview.vue
- [X] T011 [P] [US1] Apply rounded="xl" and elevation="4" to OverviewDetails.vue card in frontend/src/components/overview/OverviewDetails.vue
- [X] T012 [P] [US1] Apply rounded="xl" and elevation="4" to OverviewTable.vue card in frontend/src/components/overview/OverviewTable.vue
- [X] T013 [P] [US1] Apply rounded="xl" and elevation="4" to OverviewChart.vue card in frontend/src/components/overview/OverviewChart.vue (N/A - wrapped by Overview.vue)
- [X] T014 [P] [US1] Apply rounded="xl" and elevation="4" to CurrentAmount.vue card in frontend/src/components/overview/CurrentAmount.vue
- [X] T015 [P] [US1] Apply rounded="xl" and elevation="4" to FixedCosts.vue card in frontend/src/components/FixedCosts.vue
- [X] T016 [P] [US1] Apply rounded="xl" and elevation="4" to SpecialCosts.vue card in frontend/src/components/SpecialCosts.vue
- [X] T017 [P] [US1] Apply rounded="xl" and elevation="4" to FixedCostTable.vue card in frontend/src/components/FixedCostTable.vue
- [X] T018 [P] [US1] Apply rounded="lg" to edit form dialogs (CostEditForm, MonthlyCostEditForm, HalfyearlyCostEditForm, QuaterlyCostEditForm, YearlyCostEditForm, SpecialCostForm) in frontend/src/components/editform/
- [X] T019 [US1] Update App.vue and Layout.vue to ensure dark background is applied globally in frontend/src/App.vue and frontend/src/Layout.vue

**Checkpoint**: User Story 1 complete - application displays modern dark theme with rounded cards and proper elevation

---

## Phase 4: User Story 2 - Financial Trend Color Coding (Priority: P2)

**Goal**: Apply mint green for positive values and soft coral for negative values across all financial displays

**Independent Test**: Display sample positive and negative financial values and verify correct color application (mint green for positive, coral for negative, gray for zero)

### Tests for User Story 2

- [X] T020 [P] [US2] Create unit test for positive/negative color application logic in frontend/tests/components/color-coding.test.js
- [X] T021 [P] [US2] Create snapshot test for CurrentAmount component with positive/negative values in frontend/tests/components/CurrentAmount.test.js

### Implementation for User Story 2

- [X] T022 [P] [US2] Add CSS utility classes (.text-positive, .text-negative, .text-neutral, .bg-positive, .bg-negative) in frontend/src/finance.css
- [X] T023 [P] [US2] Update CHART_COLORS constant with theme colors (positive: #4ADE80, negative: #F87171, neutral: #9CA3AF, fill: rgba(74,222,128,0.2), gridLine: #333333) in frontend/src/components/overview/OverviewChart.vue
- [X] T024 [US2] Apply positive/negative color classes to CurrentAmount.vue based on value sign in frontend/src/components/overview/CurrentAmount.vue
- [X] T025 [US2] Apply positive/negative color logic to OverviewTable.vue financial values in frontend/src/components/overview/OverviewTable.vue
- [X] T026 [US2] Apply positive/negative color logic to OverviewDetails.vue financial values in frontend/src/components/overview/OverviewDetails.vue
- [X] T027 [US2] Update OverviewChart.vue to use CHART_COLORS for line/point rendering in frontend/src/components/overview/OverviewChart.vue
- [X] T028 [US2] Implement zero-value neutral color handling (gray #9CA3AF) in CurrentAmount.vue and OverviewTable.vue

**Checkpoint**: User Story 2 complete - positive values display mint green, negative values display coral, zero values display neutral gray

---

## Phase 5: User Story 3 - Typography Hierarchy for Financial Data (Priority: P3)

**Goal**: Apply bold, large typography to key financial figures and smaller, muted text to labels

**Independent Test**: View any screen with financial data and verify key numbers are bold/large while labels are smaller/muted

### Tests for User Story 3

- [X] T029 [P] [US3] Create unit test verifying typography classes applied correctly in frontend/tests/components/typography.test.js
- [X] T030 [P] [US3] Create snapshot test for typography hierarchy in key components in frontend/tests/components/typography-snapshot.test.js

### Implementation for User Story 3

- [X] T031 [P] [US3] Apply text-h4 font-weight-bold to key financial figures in CurrentAmount.vue in frontend/src/components/overview/CurrentAmount.vue
- [X] T032 [P] [US3] Apply text-body-2 text-medium-emphasis to labels in CurrentAmount.vue in frontend/src/components/overview/CurrentAmount.vue
- [X] T033 [P] [US3] Apply typography hierarchy (text-h5 for values, text-body-2 for labels) in OverviewDetails.vue in frontend/src/components/overview/OverviewDetails.vue
- [X] T034 [P] [US3] Apply typography hierarchy to financial columns in OverviewTable.vue in frontend/src/components/overview/OverviewTable.vue
- [X] T035 [P] [US3] Apply typography hierarchy to FixedCostTable.vue amount displays in frontend/src/components/FixedCostTable.vue
- [X] T036 [US3] Ensure consistent typography scale across all financial displays in Overview.vue in frontend/src/components/overview/Overview.vue

**Checkpoint**: User Story 3 complete - key figures are prominent, labels are supportive, clear visual hierarchy

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and quality assurance

- [X] T037 [P] Run full test suite and ensure 60% coverage is maintained with pnpm test:coverage
- [X] T038 [P] Verify WCAG AA contrast compliance for all color combinations (4.5:1 normal text, 3:1 large text)
- [X] T039 [P] Update any existing snapshot tests that fail due to theme changes
- [X] T040 Manual visual QA: verify all screens display dark theme consistently per SC-001
- [X] T041 Manual visual QA: verify positive/negative color identification within 2 seconds per SC-002
- [X] T042 Manual visual QA: verify typography hierarchy guides eye to important figures per SC-003
- [X] T043 Run quickstart.md validation steps to confirm implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 -> P2 -> P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2

### Within Each User Story

- Tests should be written first to verify expectations
- Implementation follows test definitions
- All tasks marked [P] within a story can run in parallel
- Story complete when all tasks done and checkpoint verified

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003, T004)
- All Foundational tasks run sequentially (T005 -> T006 -> T007) as they modify the same file
- Once Foundational complete, all three user stories can start in parallel
- Within US1: T010-T018 can all run in parallel (different component files)
- Within US2: T022-T023 can run in parallel, then T024-T028
- Within US3: T031-T035 can all run in parallel (different component files)

---

## Parallel Example: User Story 1 Component Updates

```bash
# Launch all card styling updates together (different files):
Task: "Apply rounded='xl' and elevation='4' to Overview.vue"
Task: "Apply rounded='xl' and elevation='4' to OverviewDetails.vue"
Task: "Apply rounded='xl' and elevation='4' to OverviewTable.vue"
Task: "Apply rounded='xl' and elevation='4' to OverviewChart.vue"
Task: "Apply rounded='xl' and elevation='4' to CurrentAmount.vue"
Task: "Apply rounded='xl' and elevation='4' to FixedCosts.vue"
Task: "Apply rounded='xl' and elevation='4' to SpecialCosts.vue"
Task: "Apply rounded='xl' and elevation='4' to FixedCostTable.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (review existing files)
2. Complete Phase 2: Foundational (theme colors in vuetify.js)
3. Complete Phase 3: User Story 1 (dark theme + rounded corners)
4. **STOP and VALIDATE**: Visual inspection confirms modern dark aesthetic
5. Deploy/demo if ready - delivers immediate visual transformation

### Incremental Delivery

1. Setup + Foundational -> Theme infrastructure ready
2. Add User Story 1 -> Dark theme + rounded cards -> Deploy/Demo (MVP!)
3. Add User Story 2 -> Color-coded financial values -> Deploy/Demo
4. Add User Story 3 -> Typography hierarchy -> Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (card styling)
   - Developer B: User Story 2 (color coding)
   - Developer C: User Story 3 (typography)
3. Stories complete and validate independently
4. All converge for Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All color values verified for WCAG AA compliance in research.md
