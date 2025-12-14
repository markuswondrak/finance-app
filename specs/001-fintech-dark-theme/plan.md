# Implementation Plan: Fintech Dark Mode Theme

**Branch**: `001-fintech-dark-theme` | **Date**: 2025-12-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fintech-dark-theme/spec.md`

## Summary

Transform the existing dark-themed finance application into a modern Fintech Dashboard with refined visual styling. Key changes include: mint green accents for positive financial trends, soft red/coral for negative trends, large rounded corners on cards using Vuetify's xl/lg presets, bold typography for key financial figures, and enhanced visual hierarchy. The implementation will leverage the existing Vuetify 3 theme system, updating the `financeDark` theme configuration and consolidating color definitions across vuetify.js, finance.css, and chart components.

## Technical Context

**Language/Version**: JavaScript (ES6+), Vue.js 2.6+, Node.js
**Primary Dependencies**: Vuetify 2.1+ (actually using Vuetify 3), Chart.js 4.4.0, vue-chartjs 5.2.0
**Storage**: N/A (frontend-only theming changes)
**Testing**: Jest + Vue Test Utils (constitution requires 60% coverage)
**Target Platform**: Web browser (desktop, tablet, mobile - responsive)
**Project Type**: Web application (frontend-only feature)
**Performance Goals**: No degradation from current performance; instant theme application
**Constraints**: WCAG AA compliance (4.5:1 contrast for normal text, 3:1 for large text)
**Scale/Scope**: ~15 Vue components, 3 configuration files (vuetify.js, finance.css, OverviewChart.vue)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | ✅ PASS | Theme refinement serves core mission of clear financial insights |
| II. User Experience Excellence (NON-NEGOTIABLE) | ✅ PASS | Directly improves UX with better visual hierarchy, WCAG compliance |
| III. Full-Stack Separation | ✅ PASS | Frontend-only changes, no backend impact |
| IV. Test Coverage Mandate (NON-NEGOTIABLE) | ⚠️ ATTENTION | Must maintain 60% coverage; visual tests may need snapshot/visual regression approach |
| V. API-First Design | ✅ PASS | No API changes required |
| VI. Data Integrity | ✅ PASS | No data changes; display-only modifications |

**Gate Status**: PASS - No blocking violations. Test coverage approach will be addressed in research phase.

## Project Structure

### Documentation (this feature)

```text
specs/001-fintech-dark-theme/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal - theme config entities)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── plugins/
│   │   └── vuetify.js           # Theme configuration (PRIMARY TARGET)
│   ├── components/
│   │   ├── overview/
│   │   │   └── OverviewChart.vue  # Chart color updates
│   │   └── [other components]     # Apply rounded corners, typography
│   ├── finance.css              # Consolidated color definitions
│   ├── App.vue
│   └── Layout.vue
└── tests/
    └── [component tests]         # Visual regression tests
```

**Structure Decision**: Frontend-only modifications within existing Vue.js/Vuetify architecture. No new directories required. Changes concentrated in:
1. `/frontend/src/plugins/vuetify.js` - Theme color palette
2. `/frontend/src/finance.css` - CSS utility classes
3. `/frontend/src/components/overview/OverviewChart.vue` - Chart colors
4. Various components - Apply rounded corners and typography classes

## Complexity Tracking

No complexity violations. This feature:
- Uses existing Vuetify theme system (no new patterns)
- Consolidates existing color definitions (reduces complexity)
- No new dependencies required
- Frontend-only scope (no architectural changes)

## Constitution Check (Post-Design)

*Re-evaluated after Phase 1 design completion.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | ✅ PASS | No new patterns introduced; uses existing Vuetify theming |
| II. User Experience Excellence (NON-NEGOTIABLE) | ✅ PASS | WCAG AA colors selected (#4ADE80, #F87171); clear typography hierarchy |
| III. Full-Stack Separation | ✅ PASS | Confirmed: no backend changes required |
| IV. Test Coverage Mandate (NON-NEGOTIABLE) | ✅ PASS | Testing strategy defined: snapshot tests + unit tests for color logic |
| V. API-First Design | ✅ PASS | No API contracts needed (frontend-only) |
| VI. Data Integrity | ✅ PASS | No data model changes |

**Post-Design Gate Status**: ✅ ALL PASS - Ready for task generation.

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Implementation Plan | `specs/001-fintech-dark-theme/plan.md` | ✅ Complete |
| Research | `specs/001-fintech-dark-theme/research.md` | ✅ Complete |
| Data Model | `specs/001-fintech-dark-theme/data-model.md` | ✅ Complete |
| Quickstart Guide | `specs/001-fintech-dark-theme/quickstart.md` | ✅ Complete |
| API Contracts | `specs/001-fintech-dark-theme/contracts/` | ✅ N/A (frontend-only) |
| Agent Context | `CLAUDE.md` | ✅ Updated |

## Next Steps

Run `/speckit.tasks` to generate the implementation task list.
