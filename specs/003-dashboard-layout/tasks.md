# Tasks: Dashboard Layout Structure

**Feature Branch**: `003-dashboard-layout`
**Feature Name**: Dashboard Layout Structure

## Implementation Strategy

We will implement the new dashboard layout incrementally, starting with component scaffolding and moving towards specific section implementations.
1.  **Setup**: Define standard properties and types.
2.  **Foundational**: Refactor the global layout to support the new floating navigation requirements.
3.  **Components**: Build independent sections (Hero Chart, KPI Cards) in parallel.
4.  **Integration**: Assemble the final Dashboard View.
5.  **Polish**: Apply final styling (glassmorphism) and accessibility checks.

Tests will be written for each component to ensure behavior matches specifications (TDD approach).

## Phase 1: Setup

Goal: Prepare project structure and shared definitions.

- [X] T001 Define mocked data structures for Chart and KPIs in `frontend/src/mockdata/dashboard.js`
- [X] T002 Create component directories in `frontend/src/components/dashboard/` (ForecastChart, KPISection, KPICard)

## Phase 2: Foundational (Blocking)

Goal: Implement the core layout changes required for the floating navigation toggle.

- [X] T003 [P] Create glassmorphism CSS utility class in `frontend/src/assets/glassmorphism.css` or `frontend/src/finance.css`
- [X] T004 Refactor `Layout.vue` to remove `v-app-bar` dependency for navigation toggling
- [X] T005 Implement floating navigation toggle button in `Layout.vue` with responsive positioning (Bottom-Left Desktop / Top-Left Mobile)
- [X] T006 Implement `v-navigation-drawer` logic: Slide-in overlay (Mobile) vs. Push content (Desktop)
- [X] T007 Write component test for `Layout.vue` verifying navigation state and toggle visibility

## Phase 3: User Story 1 - Hero Forecast Chart

Goal: Implement the prominent forecast chart with fixed aspect ratio.

- [X] T008 [US1] Create `ForecastChart.vue` component skeleton
- [X] T009 [US1] Implement fixed aspect ratio (21:9) container using CSS `aspect-ratio`
- [X] T010 [US1] Implement `v-skeleton-loader` state for `ForecastChart.vue` matching the aspect ratio
- [X] T011 [US1] Integrate `vue-chartjs` Line chart into `ForecastChart.vue`
- [X] T012 [US1] Write component test for `ForecastChart.vue` verifying aspect ratio class and loading state

## Phase 4: User Story 2 & 3 - KPI Cards & Responsive Layout

Goal: Implement the KPI row that adapts to screen size (3-col -> Stacked).

- [X] T013 [P] [US2] Create `KPICard.vue` component with props (title, value, trend, variant)
- [X] T014 [US2] Implement dynamic font sizing logic in `KPICard.vue` (FR-011)
- [X] T015 [US2] Write component test for `KPICard.vue` verifying prop rendering
- [X] T016 [US3] Create `KPISection.vue` container with responsive grid configuration (cols="12" sm="4")
- [X] T017 [US3] Implement loading state skeleton for `KPISection.vue` (3 cards)
- [X] T018 [US3] Write component test for `KPISection.vue` verifying grid classes for breakpoints

## Phase 5: Integration & Navigation

Goal: Integrate dashboard components into Overview page and finalize navigation behavior (User Story 4).

- [X] T019 [P] [US4] Integrate dashboard layout into `Overview.vue` with 21:9 aspect ratio chart
- [X] T020 [US4] Replace `CurrentAmount` with `KPISection` using real data from API
- [X] T021 [US4] Verify z-index of floating navigation toggle over dashboard content
- [X] T022 [US4] Compute KPI metrics (balance, monthly change, average) from real `entries` data

## Phase 6: Polish & Accessibility

Goal: Ensure high-quality UX and accessibility compliance.

- [X] T023 [P] Apply "Fintech Dark Mode" colors to all new components (match Constitution)
- [X] T024 Ensure floating toggle has ARIA labels and keyboard focus support (FR-018)
- [X] T025 Verify contrast ratios for glassmorphism elements
- [X] T026 Final manual verification of responsive behavior (Tablet 3-col vs Mobile Stack)
- [X] T027 Verify test coverage ≥60% before merge (Constitution IV mandate)

## Dependencies

1.  **T001-T002** (Setup) must complete first.
2.  **T003-T007** (Layout) blocks final integration but can run parallel to Component dev.
3.  **T008-T012** (Hero Chart) and **T013-T018** (KPIs) can be developed in parallel.
4.  **T019-T022** (Integration) requires all components.
