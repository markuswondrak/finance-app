# Implementation Plan: Redesign Landing Page

**Branch**: `019-landing-page-redesign` | **Date**: 2025-12-25 | **Spec**: [specs/019-landing-page-redesign/spec.md](spec.md)
**Input**: Feature specification from `/specs/019-landing-page-redesign/spec.md`

## Summary

Redesign the application landing page to be modern, sleek, and German-language, featuring a "Made in EU" statement, a Wealth Management marketing section, and an interactive savings calculator gimmick. The page will serve as the exclusive entry point with a single "Login with Google" button, automatically redirecting authenticated users to the dashboard.

## Technical Context

**Language/Version**: Vue.js 3.3+ (Frontend)
**Primary Dependencies**: Vuetify 3.3+, Chart.js (vue-chartjs), Vue Router 4.2+
**Storage**: N/A (Client-side only)
**Testing**: Vitest + Vue Test Utils
**Target Platform**: Web (Responsive)
**Project Type**: Web application (Frontend)
**Performance Goals**: Load time < 1.5s on 4G
**Constraints**: Mobile application header must be hidden; strict "Fintech Dark Mode" aesthetics.
**Scale/Scope**: Single page with ~4 distinct sections (Hero, Marketing, Calculator, Footer).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity First**: The feature is a focused presentation layer with a contained calculator tool. No complex backend logic. PASS.
- **User Experience Excellence**: Requirement for "modern, sleek" design and immediate calculator feedback aligns with this principle. PASS.
- **Full-Stack Separation**: Purely frontend implementation. PASS.
- **Test Coverage Mandate**: New components will require unit/component tests. PASS.
- **Visual Design Language**: Adherence to "Fintech Dark Mode" is required and planned. PASS.
- **Frontend Architecture**: Will follow page-centric structure `src/components/landing/`. PASS.

## Project Structure

### Documentation (this feature)

```text
specs/019-landing-page-redesign/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command) - N/A (Frontend only)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── landing/              # Feature Root
│   │   │   ├── LandingPage.vue   # Main Page
│   │   │   ├── LandingHero.vue   # Hero Section ("Made in EU", Login)
│   │   │   ├── WealthFeature.vue # Marketing Section
│   │   │   ├── SavingsCalculator.vue # Interactive Gimmick
│   │   │   └── LandingFooter.vue # Legal Links
│   │   └── commons/              # Reusable components (e.g., standard buttons if needed)
│   ├── router/
│   │   └── index.js              # Route configuration
│   └── finance.css               # Global styles (if needed)
└── tests/
    └── unit/
        └── components/
            └── landing/          # Component tests
```

**Structure Decision**: Option 2: Web application (Frontend focus). Dedicated `landing` directory in `components` per Constitution VIII.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |