# Implementation Plan: Current Balance Card with Click-to-Edit

**Branch**: `005-balance-card-edit` | **Date**: 2025-12-15 | **Spec**: `/specs/005-balance-card-edit/spec.md`
**Input**: Feature specification from `/specs/005-balance-card-edit/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a "Current Balance" highlight card on the dashboard that allows users to update their starting capital (CurrentAmount) via a click-to-edit modal. This involves creating a new `User` entity in the backend, a `PUT /user/current-amount` endpoint, and updating the frontend to display the balance, handle the edit flow, and trigger a forecast recalculation upon save.

## Technical Context

**Language/Version**: Backend: Go 1.17+, Frontend: Vue.js 3.3+
**Primary Dependencies**: Backend: Gin, GORM. Frontend: Vuetify 3.3+, Vue Router 4.2+, Chart.js 4.4+
**Storage**: PostgreSQL 15+
**Testing**: Backend: Go standard testing + testify. Frontend: Vitest + Vue Test Utils.
**Target Platform**: Web (Linux server deployment, responsive frontend).
**Project Type**: Web application (Full-stack Separation).
**Performance Goals**: Forecast chart updates within 1 second.
**Constraints**: 60% test coverage (Non-negotiable).
**Scale/Scope**: Personal finance app.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Simplicity First
- **Check**: Pass. The feature introduces a simple, direct way to update a single value without complex navigation.

### II. User Experience Excellence
- **Check**: Pass. Uses "Click-to-edit" pattern, provides immediate visual feedback (modal, chart update), and includes validation.

### III. Full-Stack Separation
- **Check**: Pass. Defines a clear API contract (`PUT /user/current-amount`) and separates UI logic from data persistence.

### IV. Test Coverage Mandate
- **Check**: Pass. Plan includes TDD approach with independent testing for both frontend and backend.

### V. API-First Design
- **Check**: Pass. New endpoint is clearly defined and follows REST patterns.

### VI. Data Integrity
- **Check**: Pass. Backend validation ensures only numeric values are saved.

### VII. Visual Design Language
- **Check**: Pass. Adheres to "Dark Mode", "Rounded Corners", and "Mint Green" accent guidelines.

## Project Structure

### Documentation (this feature)

```text
specs/005-balance-card-edit/
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
├── cmd/
│   └── server/          # Main entry point
├── internal/
│   ├── api/             # API handlers (New: user.go?)
│   ├── models/          # Data models (New: user.go)
│   └── storage/         # Database repositories (New: userRepo.go)
└── tests/

frontend/
├── src/
│   ├── components/      # UI Components (New: CurrentBalanceCard.vue, BalanceEditModal.vue)
│   ├── services/        # API services (Update: api.js or new user.js)
│   └── views/           # Dashboard view (Update: Home.vue?)
└── tests/
```

**Structure Decision**: Standard "Web application" structure with separate backend and frontend directories, consistent with existing project layout.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
