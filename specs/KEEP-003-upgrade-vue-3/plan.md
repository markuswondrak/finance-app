# Implementation Plan: Upgrade Vue 2 to Vue 3

**Branch**: `003-upgrade-vue-3` | **Date**: 2025-12-13 | **Spec**: [specs/003-upgrade-vue-3/spec.md](../spec.md)
**Input**: Feature specification from `specs/003-upgrade-vue-3/spec.md`

## Summary

Migrate the existing finance application frontend from Vue 2/Webpack to Vue 3/Vite. This involves updating core dependencies (Vue 3, Vue Router 4, Vuetify 3), replacing the build system with Vite for improved performance, and updating unit tests to be compatible with the new stack.

## Technical Context

**Language/Version**: JavaScript (Vue 3.x - Migration from 2.x)
**Primary Dependencies**: 
- Vue 3.x (from 2.6.10)
- Vuetify 3.x (from 2.1.0) - [NEEDS CLARIFICATION: Check component parity/breaking changes]
- Vue Router 4.x (from 3.1.3)
- Chart.js / vue-chartjs (needs compatible version) - [NEEDS CLARIFICATION: Identify correct version/wrapper for Vue 3]
**Build Tool**: Vite (Migration from Vue CLI/Webpack)
**Testing**: 
- Unit: Vitest (Proposed replacement for Jest due to Vite integration) - [NEEDS CLARIFICATION: Confirm if replacing Jest with Vitest is acceptable per Constitution]
**Target Platform**: Web (Modern Browsers)
**Project Type**: Web Application (Frontend)
**Performance Goals**: Dev server startup < 2s.
**Constraints**: Must maintain existing functionality and visual layout.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity First**: Vite is simpler and faster than Webpack. Vue 3 Composition API (optional) can simplify complex logic, but we will stick to Options API where possible for simplicity of migration.
- **User Experience Excellence**: Upgrade aims to maintain UX while improving developer UX (performance).
- **Full-Stack Separation**: N/A (Frontend only).
- **Test Coverage Mandate**: Must maintain > 60%. Migration of tests is a critical part of this plan.
- **API-First Design**: N/A (Frontend consumption only).
- **Data Integrity**: N/A (Frontend only).

**Potential Violations**:
- **Testing Standard**: Constitution lists "Jest" for Frontend. Moving to Vite makes Vitest a much better/simpler choice. Sticking to Jest might violate "Simplicity First" due to complex config with Vite. *Proposal: Adopt Vitest as the standard for Vue 3 frontend.*

## Project Structure

### Documentation (this feature)

```text
specs/003-upgrade-vue-3/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (Likely Unchanged)
├── quickstart.md        # Phase 1 output (Updated build commands)
├── contracts/           # Phase 1 output (N/A)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
frontend/
├── vite.config.js       # NEW: Vite configuration
├── index.html           # MOVED: From public/index.html to root of frontend/
├── package.json         # UPDATED: Dependencies and scripts
├── src/
│   ├── main.js          # UPDATED: Vue 3 mounting logic
│   ├── App.vue          # UPDATED: Syntax if needed
│   ├── router/          # UPDATED: Vue Router 4 syntax
│   ├── plugins/
│   │   └── vuetify.js   # UPDATED: Vuetify 3 setup
│   ├── components/      # UPDATED: Vuetify 3 component syntax
│   └── ...
└── tests/               # UPDATED: Test runner and specs
```

**Structure Decision**: Standard Vue 3 + Vite structure. Key change is `index.html` moving to project root (Vite convention).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Vitest instead of Jest | Constitution specifies Jest, but Vitest is the standard for Vite. | Using Jest with Vite requires complex configuration and transformation layers, violating "Simplicity First". |