# Implementation Plan: Wealth Forecast Table

**Branch**: `016-wealth-forecast-table` | **Date**: 2025-12-21 | **Spec**: [specs/016-wealth-forecast-table/spec.md](./spec.md)
**Input**: Feature specification from `specs/016-wealth-forecast-table/spec.md`

## Summary

This feature implements a detailed data table to complement the Wealth Forecast Chart. It displays year-by-year forecast values (Worst, Average, Best case) with currency formatting and styling that matches the existing Forecast Overview Table. The table provides precise numerical data that is hard to read from the chart alone.

## Technical Context

**Language/Version**: Go 1.17+ (Backend), Vue.js 3.3+ (Frontend)
**Primary Dependencies**: Gin (Go), Vuetify 3.3+, Chart.js (interaction)
**Storage**: N/A (Read-only data from existing Forecast logic)
**Testing**: Go standard testing (Backend), Vitest + Vue Test Utils (Frontend)
**Target Platform**: Web Application (Linux/Docker)
**Project Type**: Web (Frontend + Backend)
**Performance Goals**: <200ms render time (client-side data processing)
**Constraints**: Must match existing UI styling (Glass/Dark theme)
**Scale/Scope**: Displaying ~10-50 rows of data (low scale)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity First**: Pass. Adds a simple table view of existing data.
- **User Experience Excellence**: Pass. Enhances clarity of forecast data; uses skeleton loaders.
- **Full-Stack Separation**: Pass. Frontend renders data received from (or calculated based on) backend input.
- **Test Coverage Mandate**: Pass. Logic for table generation will be tested.
- **API-First Design**: Pass. Uses existing or slightly modified data structures.
- **Data Integrity**: Pass. Read-only view.
- **Visual Design Language**: Pass. Adheres to "Fintech Dark Mode" and specific table styling.

## Project Structure

### Documentation (this feature)

```text
specs/016-wealth-forecast-table/
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
│   └── models/          # Reuse/Update ForecastData structs if needed
└── tests/

frontend/
├── src/
│   ├── components/
│   │   ├── wealth/
│   │   │   ├── WealthForecastTable.vue   # NEW: The main component
│   │   │   └── WealthForecastChart.vue   # MODIFY: Add interaction event emission
│   │   └── overview/
│   │       └── OverviewTable.vue         # REFERENCE: For styling
│   └── views/
│       └── WealthPage.vue                # MODIFY: Integrate the table
└── tests/
    └── components/
        └── wealth/      # New tests
```

**Structure Decision**: Standard Vue.js component structure within the existing `wealth` domain, leveraging the existing backend data models.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
