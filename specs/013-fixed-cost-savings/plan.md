# Implementation Plan: Fixed Cost Savings

**Branch**: `013-fixed-cost-savings` | **Date**: 2025-12-20 | **Spec**: [specs/013-fixed-cost-savings/spec.md](../specs/013-fixed-cost-savings/spec.md)
**Input**: Feature specification from `/specs/013-fixed-cost-savings/spec.md`

## Summary

This feature adds a "Mark as Saving" capability to both Fixed and Special Costs. By flagging a cost as a saving, users can indicate that although it reduces the monthly surplus (like an expense), it contributes to long-term wealth (like an investment). The implementation involves adding an `is_saving` boolean field to the `FixedCost` and `SpecialCost` entities in the backend and updating the frontend forms to use a 3-state selector (Income, Expense, Saving) ensuring mutual exclusivity between "Income" and "Saving".

## Technical Context

**Language/Version**: Go 1.17+ (Backend), Vue.js 3.3+ (Frontend)
**Primary Dependencies**: Gin, GORM (Backend); Vuetify 3.3+, Vue Router 4.2+ (Frontend)
**Storage**: PostgreSQL 15+
**Testing**: Go standard testing (Backend), Vitest + Vue Test Utils (Frontend)
**Target Platform**: Linux server (Backend), Web Browser (Frontend)
**Project Type**: Web application (Full-stack)
**Performance Goals**: N/A (Standard CRUD latency)
**Constraints**: Mutual exclusivity of `incoming` and `is_saving` flags.
**Scale/Scope**: Small schema change, moderate UI update.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity First**: The 3-state selector simplifies the user decision model (one purpose per cost).
- **UX Excellence**: Clear visual indication (icon) and intuitive selection control.
- **Full-Stack Separation**: API contract updated to include `is_saving`.
- **Test Coverage**: Logic for validation and UI states will be covered.
- **API-First Design**: REST API updated.
- **Data Integrity**: Backend validation enforces `!(incoming && is_saving)`.
- **Visual Design Language**: Uses standard Vuetify components and "Fintech Dark Mode".

## Project Structure

### Documentation (this feature)

```text
specs/013-fixed-cost-savings/
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
│   ├── models/          # FixedCost and SpecialCost struct updates
│   ├── api/             # Handler updates for validation
│   └── storage/         # DB migration (GORM auto-migrate)
└── tests/

frontend/
├── src/
│   ├── components/
│   │   ├── editform/    # CostEditForm, SpecialCostForm updates
│   │   └── ...          # List views (FixedCostTable, SpecialCosts)
│   └── services/        # API service updates
└── tests/
```

**Structure Decision**: Standard full-stack web application structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |