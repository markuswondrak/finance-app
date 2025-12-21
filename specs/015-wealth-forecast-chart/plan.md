# Implementation Plan: Wealth Forecast Chart

**Branch**: `015-wealth-forecast-chart` | **Date**: 2025-12-20 | **Spec**: [specs/015-wealth-forecast-chart/spec.md](specs/015-wealth-forecast-chart/spec.md)
**Input**: Feature specification from `specs/015-wealth-forecast-chart/spec.md`

## Summary

Implement a Wealth Forecast Chart on the `WealthOverviewPage`. The backend will calculate monthly compound interest projections for 3 scenarios (Worst, Average, Best) plus a "Total Invested" baseline over the user's configured duration. The frontend will render this as a 4-series line chart using the application's gradient styling.

## Technical Context

**Language/Version**: Go 1.17+, Vue.js 3.3+
**Primary Dependencies**: Gin (Go), GORM (Go), Vuetify 3.3+, Chart.js 4.4+ (vue-chartjs)
**Storage**: PostgreSQL 15+ (Read-only for this feature)
**Testing**: Go standard testing, Vitest + Vue Test Utils
**Target Platform**: Web application (Linux server hosting)
**Project Type**: Web application
**Performance Goals**: Sub-200ms API response for forecast calculation.
**Constraints**: Must match existing "Dark Mode / Neon" aesthetic.
**Scale/Scope**: Single page component, but core value proposition.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity First**: ✅ Feature is focused on a single visual projection.
- **UX Excellence**: ✅ Provides clear visual feedback on wealth growth.
- **Full-Stack Separation**: ✅ Backend calculates, Frontend renders.
- **Test Coverage**: ✅ Plan includes unit and integration tests.
- **API-First**: ✅ Defining `GET /api/wealth/forecast`.
- **Data Integrity**: ✅ Read-only operation, relies on validated data.
- **Visual Design**: ✅ Explicitly copying existing aesthetic.

## Project Structure

### Documentation (this feature)

```text
specs/015-wealth-forecast-chart/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── internal/
│   ├── api/             # WealthHandler
│   ├── models/          # WealthProfile, FixedCost (existing)
│   └── services/        # WealthForecastService (new)
└── tests/
    └── integration/     # API tests

frontend/
├── src/
│   ├── components/
│   │   └── dashboard/   # WealthForecastChart.vue (new)
│   ├── pages/           # WealthOverviewPage.vue (update)
│   └── services/        # WealthService.js (update)
└── tests/
    └── unit/            # Component tests
```

**Structure Decision**: Standard Web Application structure (Option 2).