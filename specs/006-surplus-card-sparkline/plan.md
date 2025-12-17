# Implementation Plan: Monthly Surplus Card with Sparkline

**Branch**: `006-surplus-card-sparkline` | **Date**: 2025-12-15 | **Spec**: `/specs/006-surplus-card-sparkline/spec.md`
**Input**: Feature specification from `/specs/006-surplus-card-sparkline/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a "Monthly Surplus" highlight card for the dashboard that displays the calculated "safe-to-spend" income (Income - Fixed Costs) and a sparkline chart showing the trend of this surplus over the last 6 months. This requires a new backend calculation to derive "Monthly Income" from positive fixed costs and generate historical data points based on current cost definitions, exposed via a new API endpoint.

## Technical Context

**Language/Version**: Backend: Go 1.17+, Frontend: Vue.js 3.3+
**Primary Dependencies**: Backend: Gin, GORM. Frontend: Vuetify 3.3+, Chart.js 4.4+ (vue-chartjs), Vue Router 4.2+
**Storage**: PostgreSQL 15+
**Testing**: Backend: Go standard testing + testify. Frontend: Vitest + Vue Test Utils.
**Target Platform**: Linux server (Web).
**Project Type**: Web application (Full-stack Separation).
**Performance Goals**: Card renders < 1s.
**Constraints**: 60% test coverage (Non-negotiable).
**Scale/Scope**: Personal finance app.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Simplicity First
- **Check**: Pass. The feature adds a single derived metric to help users, avoiding complex manual tracking.

### II. User Experience Excellence
- **Check**: Pass. Uses visual trend (sparkline) and clear "safe-to-spend" number.

### III. Full-Stack Separation
- **Check**: Pass. Backend calculates the metric; Frontend handles presentation (sparkline rendering).

### IV. Test Coverage Mandate
- **Check**: Pass. Plan includes unit tests for the new calculation logic and component tests for the card.

### V. API-First Design
- **Check**: Pass. New endpoint `GET /api/statistics/surplus` (or similar) will be defined.

### VI. Data Integrity
- **Check**: Pass. Read-only operation derived from existing validated data.

### VII. Visual Design Language
- **Check**: Pass. Adheres to "Dark Mode", "Rounded Corners", and "Mint Green/Coral" color coding.

## Project Structure

### Documentation (this feature)

```text
specs/006-surplus-card-sparkline/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── internal/
│   ├── api/             # API handlers (New: statistics.go)
│   └── models/          # Data models (Update: fixedcost.go methods?)
└── tests/

frontend/
├── src/
│   ├── components/
│   │   └── dashboard/   # UI Components (New: MonthlySurplusCard.vue)
│   └── services/        # API services (New: statistics.js)
└── tests/
```

**Structure Decision**: Standard "Web application" structure with separate backend and frontend directories.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |