# Implementation Plan: Wealth Overview Redesign

**Branch**: `018-wealth-overview-redesign` | **Date**: 2025-12-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/018-wealth-overview-redesign/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Redesign the Wealth Overview page to align with the Dashboard's visual style. The existing `WealthConfigPanel` will be replaced by three interactive KPI cards: "Current Wealth", "Time Horizon", and "Expected Return". These cards will display key metrics and derived insights (e.g., next 100k milestone) calculated on the frontend. Clicking a card will open a dedicated modal for editing its specific parameters. The implementation involves refactoring the shared `KPICard` component for reuse, creating the new card section in `WealthOverviewPage`, and leveraging the existing `WealthProfile` and `ForecastResponse` data structures.

## Technical Context

**Language/Version**: Go 1.24.0 (Backend), Vue.js 3.3.4 (Frontend)
**Primary Dependencies**: Gin, GORM (Backend); Vuetify 3.3.15, Chart.js 4.4.0 (Frontend)
**Storage**: PostgreSQL 15
**Testing**: Testify (Go), Vitest + Vue Test Utils (Frontend)
**Target Platform**: Web Application (Linux/Docker)
**Project Type**: Web Application (Frontend + Backend)
**Performance Goals**: <2s forecast refresh
**Constraints**: Visual consistency with Dashboard
**Scale/Scope**: Frontend-heavy refactor, minor component changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Simplicity First**: Focuses on clear insights (cards) instead of a complex panel.
- [x] **UX Excellence**: Interactive cards, immediate feedback, responsive design.
- [x] **Full-Stack Separation**: Frontend handles presentation/calculations, Backend provides raw data.
- [x] **Test Coverage**: Components will be tested (Vitest).
- [x] **Visual Design**: Follows Fintech Dark Mode and Dashboard style.

## Project Structure

### Documentation (this feature)

```text
specs/018-wealth-overview-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.yaml
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── internal/
│   ├── models/          # WealthProfile, ForecastResponse (existing)
│   ├── services/        # WealthForecastService (existing)
│   └── api/             # Handlers (existing)

frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── BaseHighlightCard.vue  # Renamed/Moved from overview/KPICard.vue (Refactored shared component)
│   │   ├── overview/
│   │   │   └── KPICard.vue        # To be moved/renamed
│   │   └── wealth/
│   │       ├── WealthOverviewPage.vue  # Main page (to be updated)
│   │       ├── WealthConfigPanel.vue   # To be deleted/replaced
│   │       └── [New Modals].vue        # New edit components
│   └── services/
│       └── wealthService.js       # API client (existing)
└── tests/
    └── unit/
        └── components/
            └── wealth/            # New tests
```

**Structure Decision**: Refactor `KPICard.vue` into `BaseHighlightCard.vue` and move to `frontend/src/components/common/`. Implement new logic and modals within `frontend/src/components/wealth/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
