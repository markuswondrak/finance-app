# Implementation Plan: User Onboarding Guide

**Branch**: `023-user-onboarding-guide` | **Date**: 2025-12-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/023-user-onboarding-guide/spec.md`

## Summary

Implement a step-through wizard onboarding guide that introduces new users to the five main features of the Finanz app (Overview, Wealth, Save-to-Spend, Fixed Costs, Special Costs). The guide displays automatically on first login, tracks completion status in the backend database for cross-device sync, and is accessible on-demand via a new Help section in the sidebar navigation.

## Technical Context

**Language/Version**: Go 1.17+ (backend), Vue.js 3.3+ (frontend)
**Primary Dependencies**: Gin (HTTP router), GORM v1.21+ (ORM), Vuetify 3.3+ (UI), Vue Router 4.2+
**Storage**: PostgreSQL 15+ (onboarding status stored in user profile)
**Testing**: Go standard testing + Vitest/Vue Test Utils (frontend)
**Target Platform**: Web application (desktop + mobile responsive)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Guide loads instantly (<100ms), no impact on app startup performance
**Constraints**: Must work on mobile screens, content in German
**Scale/Scope**: All authenticated users, 7 wizard steps (welcome + 5 features + navigation)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | ✅ PASS | Feature serves core mission of helping users understand financial tools |
| II. UX Excellence | ✅ PASS | Step-through wizard provides guided, responsive experience |
| III. Full-Stack Separation | ✅ PASS | Backend stores status, frontend handles presentation |
| IV. Test Coverage (60%) | ⚠️ REQUIRED | Must write tests for backend endpoints and frontend components |
| V. API-First Design | ✅ PASS | New endpoints follow existing REST patterns |
| VI. Data Integrity | ✅ PASS | Onboarding status persisted in database |
| VII. Visual Design Language | ✅ PASS | Will use Vuetify dialog with dark theme |
| VIII. Frontend Architecture | ✅ PASS | New components in dedicated `help/` directory |
| IX. Backend Architecture | ✅ PASS | Extends existing user domain |

**All gates pass. Proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/023-user-onboarding-guide/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── image-requirements.md # Screenshot specifications
├── contracts/           # Phase 1 output
│   └── onboarding-api.yaml
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── internal/
│   ├── user/
│   │   ├── model.go           # ADD: OnboardingStatus field
│   │   ├── api/
│   │   │   └── handler.go     # ADD: PATCH /api/user/onboarding-status
│   │   └── service/
│   │       └── service.go     # EXTEND: Onboarding status logic
│   └── storage/
│       └── userRepo.go        # EXTEND: UpdateOnboardingStatus method
└── tests/
    └── user/
        └── onboarding_test.go # NEW: Integration tests

frontend/
├── src/
│   ├── assets/
│   │   └── onboarding/        # NEW: Screenshot images for wizard
│   │       ├── welcome.png
│   │       ├── overview.png
│   │       ├── wealth.png
│   │       ├── save-to-spend.png
│   │       ├── fixed-costs.png
│   │       ├── special-costs.png
│   │       └── navigation.png
│   ├── components/
│   │   ├── help/              # NEW: Help section components
│   │   │   ├── HelpPage.vue           # Help page with guide access
│   │   │   └── OnboardingWizard.vue   # Step-through wizard modal
│   │   └── navigation/
│   │       └── AppSidebar.vue # MODIFY: Add Help menu item
│   ├── services/
│   │   └── user.js            # EXTEND: Onboarding status methods
│   └── router/
│       └── index.js           # ADD: /help route
└── tests/
    └── components/
        └── help/
            └── OnboardingWizard.test.js  # NEW: Component tests
```

**Structure Decision**: Web application structure following existing patterns. New components colocated in `help/` directory per Frontend Architecture principle. Backend changes extend the existing `user` domain per Backend Architecture principle.

## Complexity Tracking

No violations to justify. Feature follows all constitution principles with minimal additions to existing architecture.
