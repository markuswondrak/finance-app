# Implementation Plan - Redesign table interface with Action Bar

**Feature Branch**: `020-table-action-bar`
**Spec**: [specs/020-table-action-bar/spec.md](spec.md)

## Technical Context

<!--
  ACTION REQUIRED: Identify technical components, existing patterns, and constraints.
  Mark unknown technical details with [NEEDS CLARIFICATION: <specific question>]
-->

### Architecture & Components

- **Frontend**: Vue.js 3 + Vuetify 3
- **New Component**: `src/components/common/TableActionBar.vue`
  - Props: `search` (modelValue), `date` (modelValue - for MonthYearDatepicker)
  - Slots: `action` (for the "Add New" button)
  - Internal: Wraps `v-text-field` and `MonthYearDatepicker`.
- **Modified Components**:
  - `src/components/fixedcosts/FixedCostsPage.vue`: Integrate Action Bar, implement filtering logic (Year-Month overlap), pass state to `FixedCostTable`.
  - `src/components/fixedcosts/FixedCostTable.vue`: Remove internal "Add New" button (via `#actions` slot removal).
  - `src/components/SpecialCostsPage.vue`: Integrate Action Bar, implement filtering logic (Due Date match), remove internal "Add New" button.
- **State Management**: Local component state (Search query, Selected Date).
- **Filtering Logic**: Client-side filtering.
  - Fixed Costs: 
    - `name` or `description` contains `searchQuery`.
    - AND (`selectedDate` is null OR `cost` overlaps `selectedDate`).
  - Special Costs: 
    - `name` contains `searchQuery`.
    - AND (`selectedDate` is null OR `cost.dueDate` matches `selectedDate`).

### Database & Data Model

- No database changes required.
- Data loading remains as is.

### Dependencies

- **Vuetify Components**: `v-text-field` (search), `v-btn` (add), `v-row`, `v-col`.
- **Custom Components**: `MonthYearDatepicker` (existing).
- **Icons**: FontAwesome (existing integration).

### Unknowns & Riskiest Assumptions

- None.

## Constitution Check

<!--
  ACTION REQUIRED: Check against .specify/memory/constitution.md
-->

### Core Principles

- [x] **I. Simplicity First**: Consolidates actions into a single bar.
- [x] **II. UX Excellence**: Adds search/filter. Responsive design. Clear default state.
- [x] **III. Full-Stack Separation**: Pure frontend change.
- [x] **IV. Test Coverage**: Component tests for `TableActionBar` and filtering logic.
- [x] **VII. Visual Design**: Consistent with existing dark theme.

### Quality Gates

- [x] **Tests**: Unit/Component tests for filtering and UI interactions.
- [x] **Styles**: Consistent with existing dark theme.
- [x] **Responsiveness**: Mobile-first design for the Action Bar.

## Phases

### Phase 0: Discovery & Research

- [x] Analyze existing `FixedCostsPage` and `SpecialCostsPage`.
- [x] Check `FixedCostTable` and `BaseTable` structure.
- [x] Confirm data loading strategy.
- [x] **Clarified**: Filter uses `MonthYearDatepicker`.
- [x] **Clarified**: Logic is specific Year-Month overlap.
- [x] **Clarified**: Search limited to Name/Description.

### Phase 1: Design & Contracts

- [ ] Update `data-model.md` (defining the UI state and specific filtering logic).
- [ ] Update `quickstart.md` (how to test the UI with new filter).
- [ ] Update agent context.

### Phase 2: Implementation

- [ ] Create `TableActionBar.vue`.
- [ ] Refactor `FixedCostsPage.vue` & `FixedCostTable.vue`.
- [ ] Refactor `SpecialCostsPage.vue`.
- [ ] Add tests.