# Implementation Plan - Dashboard Layout Structure

**Feature**: Dashboard Layout Structure (`003-dashboard-layout`)
**Status**: Draft

## Technical Context

**Language/Framework**: Vue.js 3, Vuetify 3, Vite
**Architecture**: Component-based architecture using Vuetify's Grid system (`v-row`, `v-col`) and Application layout components (`v-navigation-drawer`, `v-main`).

**Component Structure**:
- **Layout**: `Layout.vue` (Global shell) - needs modification for floating navigation.
- **Page**: `DashboardView.vue` (Main entry) - orchestrates Hero and KPI sections.
- **Hero**: `ForecastChart.vue` (Wrapper for chart) - handles aspect ratio and loading state.
- **KPI**: `KPISection.vue` (Container) & `KPICard.vue` (Individual card) - handles responsive grid and content display.

**Unknowns & Clarifications**:
- **Navigation Drawer Interaction**: Precisely implementing "floating toggle" while maintaining "push content" behavior on desktop might require custom CSS alongside `v-navigation-drawer`.
- **Glassmorphism Support**: Need to ensure `backdrop-filter` is supported or provide fallback (though widely supported now).
- **Chart Aspect Ratio**: `vue-chartjs` supports `maintainAspectRatio`. We need to ensure the *container* enforces the 21:9 ratio even when loading (skeleton).

## Constitution Check

| Principle | Status | Notes |
| :--- | :--- | :--- |
| **I. Simplicity** | ✅ | Layout focuses on key data (Forecast + 3 KPIs). |
| **II. UX Excellence** | ✅ | Responsive design, loading states (skeletons), and "glassmorphism" toggle improve usability. |
| **III. Separation** | ✅ | Pure frontend layout implementation. |
| **IV. Test Coverage** | ⚠️ | **CRITICAL**: Must write component tests for `DashboardView`, `KPICard`, and `Layout.vue` changes to meet 60% target. |
| **V. API-First** | ✅ | No new API contracts; consumes existing/mocked data structures. |
| **VI. Data Integrity** | N/A | Layout focus. |
| **VII. Visual Design** | ✅ | Aligns explicitly with "Fintech Dark Mode" (Hero, KPI rows, colors). |

**Gate Status**: **PASS**

## Phase 0: Research & Prototype

**Goal**: Validate layout techniques and navigation behavior.

- [x] **Research**: Verify `v-navigation-drawer` customization for "floating toggle + push content" hybrid behavior.
- [x] **Research**: Confirm `backdrop-filter` browser support and Vuetify integration.
- [x] **Prototype**: Create a throwaway layout to test the "Fixed Aspect Ratio" skeleton container CSS.
- [x] **Decision**: Finalize component hierarchy and prop definitions.

**Output**: `research.md`

## Phase 1: Design & Contracts

**Goal**: Define component interfaces and data structures.

- [x] **Data Model**: Define `KPICard` props (title, value, trend, loading) and `ForecastChart` props (loading state).
- [x] **Contracts**: Define the *internal* component contracts (props/events). No new API endpoints expected.
- [x] **Agent Context**: Update Gemini context with new component definitions.

**Output**: `data-model.md`, `contracts/` (component interfaces), `quickstart.md`, `GEMINI.md` update.

## Phase 2: Implementation (Planned)

1.  **Layout Refactor**: Modify `Layout.vue` to support floating navigation toggle (remove `v-app-bar` dependency for nav).
2.  **Dashboard Page**: Create `DashboardView.vue` with `v-container`.
3.  **Hero Section**: Implement `ForecastChart.vue` with 21:9 aspect ratio and skeleton loader.
4.  **KPI Section**: Implement `KPISection.vue` and `KPICard.vue` with responsive grid (3-col desktop, stack mobile).
5.  **Styling**: Apply "Fintech Dark Mode" colors and glassmorphism.
6.  **Tests**: Write Unit/Component tests for all new components.
