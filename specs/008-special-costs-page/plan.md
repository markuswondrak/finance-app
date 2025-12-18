# Implementation Plan: Special Costs Page Functionality

**Branch**: `008-special-costs-page` | **Date**: 2025-12-17 | **Spec**: [specs/008-special-costs-page/spec.md](spec.md)
**Input**: Feature specification from `specs/008-special-costs-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Enable full functionality for the "Special Costs" page by refactoring the existing frontend components (`SpecialCosts.vue`, `SpecialCostForm.vue`) to interact with the existing backend API. This includes displaying future special costs in a table and adding a new cost via a modal with an Income/Expense toggle.

## Technical Context

**Language/Version**: Go 1.17+ (Backend), Vue.js 3.3+ (Frontend)
**Primary Dependencies**: Gin (Go), GORM (Go), Vuetify 3.3+ (Vue)
**Storage**: PostgreSQL 15+ (Existing schema)
**Testing**: Go testing package (Backend), Vitest (Frontend)
**Target Platform**: Web Application
**Project Type**: Full-stack Web Application
**Performance Goals**: < 200ms API response, instant UI updates
**Constraints**: Must use existing `YearMonth` precision for dates; Backend schema is fixed.
**Scale/Scope**: Single page + Modal, existing API endpoints.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
| :--- | :--- | :--- |
| **I. Simplicity First** | ✅ Pass | Refactoring existing code rather than rewriting. |
| **II. UX Excellence** | ✅ Pass | Adding user-friendly Income/Expense toggle. |
| **III. Full-Stack Separation** | ✅ Pass | Clear API contract exists; frontend consumes it. |
| **IV. Test Coverage** | ✅ Pass | Will add component tests for the refactored page. |
| **V. API-First Design** | ✅ Pass | Using existing REST endpoints. |
| **VI. Data Integrity** | ✅ Pass | Backend validation rules apply. |
| **VII. Visual Design** | ✅ Pass | Using Vuetify components matching the theme. |

## Project Structure

### Documentation (this feature)

```text
specs/008-special-costs-page/
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
│   ├── api/
│   │   └── specialcosts.go    # Existing handlers (verify/update)
│   └── models/
│       └── specialcost.go     # Existing model

frontend/
├── src/
│   ├── components/
│   │   ├── SpecialCosts.vue           # Main page to refactor
│   │   └── editform/
│   │       └── SpecialCostForm.vue    # Modal form to refactor
│   └── services/
│       └── specialcosts.js            # API service (create if missing)
└── tests/
    └── unit/
        └── components/
            ├── SpecialCosts.spec.js
            └── editform/
                └── SpecialCostForm.spec.js
```

**Structure Decision**: Standard Vue.js + Go project structure. Refactoring existing components in place.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (None) | | |
