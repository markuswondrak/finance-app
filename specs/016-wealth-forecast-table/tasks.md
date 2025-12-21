# Tasks: Wealth Forecast Table

**Feature**: `016-wealth-forecast-table`
**Total Tasks**: 11

## Phase 1: Setup
*Goal: Initialize project environment for the new feature.*

- [x] T001 Verify project dependencies (Vuetify, Chart.js) are installed in frontend/package.json

## Phase 2: Foundational
*Goal: Create component structure and test scaffolding.*

- [x] T010 [P] Extract common table styling (glass, border, card-accent-primary) into reusable frontend/src/components/common/BaseTable.vue
- [x] T002 [P] Create initial component shell for WealthForecastTable in frontend/src/components/wealth/WealthForecastTable.vue
- [x] T003 [P] Create unit test file with initial import tests in frontend/src/tests/components/wealth/WealthForecastTable.spec.js

## Phase 3: User Story 1 - View Detailed Forecast Data
*Goal: As a user, I want to see a table with the exact yearly numbers for my wealth forecast.*
*Priority: P2*

**Independent Test**: Verify table appears below chart with correct yearly aggregated data and matches chart values.

- [x] T004 [US1] Implement data transformation logic (Monthly to Yearly) in frontend/src/components/wealth/WealthForecastTable.vue
- [x] T005 [US1] Implement table rendering with columns (Year, Invested, Worst, Average, Best) in frontend/src/components/wealth/WealthForecastTable.vue
- [x] T006 [US1] Integrate BaseTable.vue for styling and implement loading state (Skeleton) in frontend/src/components/wealth/WealthForecastTable.vue
- [x] T007 [US1] Integrate WealthForecastTable into frontend/src/pages/WealthPage.vue below the chart
- [x] T008 [US1] Implement row hover interaction to highlight chart points in frontend/src/components/wealth/WealthForecastTable.vue and frontend/src/pages/WealthPage.vue

## Phase 4: Polish & Cross-Cutting
*Goal: Final UI tweaks and cleanup.*

- [x] T011 Refactor frontend/src/components/overview/OverviewTable.vue to use the new BaseTable.vue component
- [x] T009 Ensure currency formatting matches the rest of the application in frontend/src/components/wealth/WealthForecastTable.vue

## Dependencies

1. T001 -> T010, T002, T003
2. T010 -> T006, T011
3. T002 -> T004, T005, T006
4. T004 -> T007
5. T007 -> T008 (Needs both components in page)

## Implementation Strategy

1. **MVP**: T010, T002, T004, T005, T007 (Basic table showing data)
2. **UX**: T006 (Styling), T008 (Interaction)
3. **Polish**: T011, T009
