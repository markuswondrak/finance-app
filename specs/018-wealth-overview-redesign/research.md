# Research: Wealth Overview Redesign

**Feature**: `018-wealth-overview-redesign`
**Date**: 2025-12-22

## Decisions & Rationale

### 1. Frontend-Calculated Milestones
**Decision**: Calculate "Next 100k", "Final Portfolio Value", and "Risk Spread" directly in the frontend using the `ForecastResponse` data.
**Rationale**: The `getForecast` API already returns the full simulation data (`ForecastPoint` array) for the chart. Calculating these simple derived values on the client avoids changing the backend API or adding a new endpoint, reducing complexity and latency.
**Implementation**: `WealthOverviewPage.vue` will pass the `forecast` prop to the highlight cards (or a computed wrapper) to extract these values.

### 2. Card Interaction & Editing
**Decision**: Use 3 separate modals, one for each card type, triggered by clicking the card.
**Rationale**: Keeps the UI focused. A single "edit all" modal would be too heavy and duplicate the old panel's problem. Separate modals allow for context-specific validation and simpler forms.
**Implementation**: 
- `CurrentWealthModal.vue`
- `TimeHorizonModal.vue`
- `ExpectedReturnModal.vue`
(Or a single `WealthEditModal.vue` with dynamic content/props to reduce file count, but separate logical forms).
**Refinement**: Given the simplicity, a single `WealthEditDialog.vue` component that accepts a `mode` prop ('wealth', 'duration', 'return') might be cleaner than 3 files.

### 3. Component Architecture
**Decision**: Refactor `KPICard.vue` to be more generic and create `WealthHighlightCard.vue` (or similar) if significant custom logic is needed, OR just use `KPICard` with slots.
**Rationale**: `KPICard` is already used on the dashboard. Adding a `footer` slot and `click` event emission allows it to be reused for the Wealth Overview without breaking existing usages. The Wealth-specific logic (milestone calculation) should live in the parent (`WealthOverviewPage`) or a specific wrapper `WealthKPIs.vue`, keeping `KPICard` dumb.
**Plan**:
1. Modify `KPICard.vue`: Add `footer` slot, `hover` effect class, emit `click`.
2. Create `WealthKPISection.vue`: Contains the 3 `KPICard`s and the logic to feed them data.

### 4. Error Handling
**Decision**: Use a global-style snackbar notifications.
**Rationale**: `WealthConfigPanel` had a local snackbar. Since we are removing the panel, the `WealthOverviewPage` needs to host the `v-snackbar` to show messages from the edit dialogs.
**Implementation**: Add `v-snackbar` to `WealthOverviewPage.vue`.

## Unknowns & Clarifications

| Unknown | Resolution |
|---------|------------|
| Data availability for milestones | `ForecastResponse` contains `Points` array (Year, Invested, Worst, Avg, Best). Sufficient for calculations. |
| Global Notification System | Does not strictly exist as a global service. Will implement `v-snackbar` in `WealthOverviewPage` to serve its children. |

## Alternatives Considered

- **Backend-calculated milestones**: Rejected. Adds unnecessary API surface area for purely presentational derived data.
- **Inline editing**: Rejected. Not enough space on the cards for input fields and validation messages; modals are cleaner.
