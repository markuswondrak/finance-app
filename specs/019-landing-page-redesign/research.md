# Research & Decisions: Redesign Landing Page

## 1. Routing & Authentication
**Decision**: Use existing `Vue Router` configuration with `guestOnly` meta guard.
**Rationale**: The current implementation in `frontend/src/router/index.js` already supports a root path (`/`) for `LandingPage` with a `beforeEach` guard that redirects authenticated users to `/overview`. This matches the requirement exactly without new infrastructure.
**Alternatives**: Middleware logic in a separate service (rejected: redundant).

## 2. Charting Library
**Decision**: `vue-chartjs` (Chart.js wrapper).
**Rationale**: Already used in the project (e.g., `WealthOverviewPage`). Provides lightweight, responsive charts suitable for the "growth curve" gimmick.
**Implementation Detail**: Use a simple `Line` chart with gradient fill to match the "Fintech Dark Mode" aesthetic (Mint Green accent).

## 3. "Made in EU" Statement
**Decision**: Prominent text badge in `LandingHero.vue`.
**Rationale**: Meets the requirement for visibility. Can be styled with a flag icon or distinct typography to build trust.

## 4. Calculator Logic
**Decision**: Client-side calculation in `SavingsCalculator.vue`.
**Rationale**: Simple compound interest formula does not require backend round-trips.
**Formula**: `A = P * (((1 + r/12)^(12*t) - 1) / (r/12))` where `P` = monthly contribution, `r` = annual rate, `t` = years. (Simplified annuity formula for monthly contributions).

## 5. Responsive Header Hiding
**Decision**: CSS media query or Vue conditional class based on viewport width in `App.vue` or `Layout.vue`.
**Rationale**: The requirement is to hide the application header on small screens *only* for the landing page.
**Correction**: Actually, the requirement says "when the landing page is active". Since the landing page layout might differ from the authenticated layout, it's cleaner to have the `LandingPage` use a layout *without* the standard app header, or pass a prop to the main layout to disable it.
**Refined Decision**: Ensure `LandingPage` does not use the standard authenticated layout wrapper if possible, or use route meta to toggle header visibility in the main `App.vue` / `Layout` component. The `meta: { hideNavigation: true }` in `router/index.js` likely already controls this. I will verify if `AppSidebar` or a top bar respects this.
