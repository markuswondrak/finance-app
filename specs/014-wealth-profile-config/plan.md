# Implementation Plan: Wealth Profile Configuration

**Branch**: `014-wealth-profile-config` | **Date**: 2025-12-20 | **Spec**: [specs/014-wealth-profile-config/spec.md](../014-wealth-profile-config/spec.md)
**Input**: Feature specification from `/specs/014-wealth-profile-config/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The goal is to allow users to configure their wealth profile parameters (Current Wealth, Forecast Duration, and Return Rates) to drive future wealth forecasts. 
Technical approach involves creating a new `wealth_profiles` table in PostgreSQL, exposing CRUD endpoints via the Go/Gin backend, and implementing a configuration UI using a collapsible expansion panel in the Vue.js frontend.
Forecast calculations and charts are explicitly out of scope.

## Technical Context

**Language/Version**: Backend: Go 1.17+, Frontend: Vue.js 3.3+ (Javascript ES6+)
**Primary Dependencies**: Backend: Gin, GORM. Frontend: Vuetify 3.3+, Vue Router 4.2+
**Storage**: PostgreSQL 15+ (New table `wealth_profiles`)
**Testing**: Backend: Go testing + testify. Frontend: Vitest + Vue Test Utils.
**Target Platform**: Web Application (Linux/Docker)
**Project Type**: Web Application
**Performance Goals**: Standard CRUD response times (<200ms).
**Constraints**: Single wealth profile per user. Strict input validation ranges.
**Scale/Scope**: Low data volume (1 row per user).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | Simple CRUD, single profile per user. |
| II. UX Excellence | PASS | Collapsible panel, inline validation, dark mode. |
| III. Full-Stack Separation | PASS | Independent Backend API and Frontend UI. |
| IV. Test Coverage | PASS | Mandate for 60% coverage acknowledged. |
| V. API-First Design | PASS | REST API contract will be defined. |
| VI. Data Integrity | PASS | Database constraints (Unique UserID) & Backend validation. |
| VII. Visual Design | PASS | "Fintech Dark Mode", Mint/Coral accents. |

## Project Structure

### Documentation (this feature)

```text
specs/014-wealth-profile-config/
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
│   ├── api/             # HTTP Handlers
│   ├── models/          # GORM Structs
│   └── storage/         # DB Access
└── tests/

frontend/
├── src/
│   ├── components/      # WealthConfigPanel.vue
│   ├── pages/           # WealthOverviewPage.vue
│   └── services/        # wealthService.js
└── tests/
```

**Structure Decision**: Standard Web Application structure with separated Backend and Frontend.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
