# Implementation Plan: Lowest Projected Point Card (Risk Metric)

**Branch**: `007-lowest-point-risk-card` | **Date**: 2025-12-17 | **Spec**: [specs/007-lowest-point-risk-card/spec.md](spec.md)
**Input**: Feature specification from `specs/007-lowest-point-risk-card/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a new `LowestPointCard.vue` component for the dashboard that calculates and displays the minimum projected balance from the forecast data. The card will use conditional styling (green/red) to warn users of potential liquidity risks. It will be integrated into the `Overview.vue` dashboard, reusing the existing `entries` data.

## Technical Context

**Language/Version**: Vue.js 3.3+ (Frontend only)
**Primary Dependencies**: Vuetify 3.3+, Javascript (ES6+)
**Storage**: N/A (Frontend derived state)
**Testing**: Vitest + Vue Test Utils
**Target Platform**: Web Browser
**Project Type**: Web Application (Frontend)
**Performance Goals**: Instant calculation (<10ms)
**Constraints**: Must match existing dashboard UI and color theme
**Scale/Scope**: Single Component

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
| :--- | :--- | :--- |
| **I. Simplicity First** | ✅ Pass | Logic encapsulated in a single component; no backend changes. |
| **II. UX Excellence** | ✅ Pass | Provides immediate, actionable feedback on financial risk. |
| **III. Full-Stack Separation** | ✅ Pass | Pure frontend logic using existing API data. |
| **IV. Test Coverage** | ✅ Pass | Component tests will be implemented (`LowestPointCard.spec.js`). |
| **V. API-First Design** | ✅ Pass | Consumes existing `entries` data structure. |
| **VI. Data Integrity** | ✅ Pass | Read-only display; no data modification. |
| **VII. Visual Design** | ✅ Pass | Adheres to "Fintech Dark Mode" and defined color palette. |

## Project Structure

### Documentation (this feature)

```text
specs/007-lowest-point-risk-card/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── LowestPointCard.vue    # [NEW] The risk metric card
│   │   └── overview/
│   │       └── Overview.vue           # [UPDATE] Integrate the card
└── tests/
    └── unit/
        └── components/
            └── dashboard/
                └── LowestPointCard.spec.js # [NEW] Component tests
```

**Structure Decision**: Standard Vue.js component structure, placing the new card in the `dashboard` directory alongside existing KPI cards.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (None) | | |
