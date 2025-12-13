# Phase 0: Research & Migration Strategy

**Feature**: Upgrade Vue 2 to Vue 3
**Date**: 2025-12-13

## Decisions & Rationale

### 1. Testing Framework: Switch to Vitest
- **Decision**: Replace Jest with **Vitest**.
- **Rationale**: 
  - Vitest is built natively for Vite, offering out-of-the-box support for ESM and Vue SFCs.
  - It shares a compatible API with Jest (`describe`, `it`, `expect`), minimizing the rewrite of test logic.
  - Using Jest with Vite requires complex configuration (babel, separate transformers) which violates the "Simplicity First" principle.
- **Alternatives Considered**: 
  - *Keep Jest*: rejected due to complexity and poor performance with Vite.

### 2. UI Framework: Upgrade to Vuetify 3
- **Decision**: Upgrade to **Vuetify 3**.
- **Rationale**: 
  - Essential for Vue 3 compatibility.
  - Provides a modern Material Design 3 implementation.
- **Migration Note**: 
  - Grid system changes (Flexbox to CSS Grid in some places, but mostly similar classes).
  - `v-data-table` implementation has changed.
  - Global configuration uses `createVuetify`.
  - Icon fonts (MDI) setup needs to be verified.

### 3. Charts: Upgrade `vue-chartjs`
- **Decision**: Upgrade to **vue-chartjs 5.x** (compatible with Chart.js 4.x).
- **Rationale**: 
  - Official wrapper, supports Vue 3.
- **Migration Note**: 
  - Chart registration is explicit (tree-shakable).
  - Prop structure for data and options remains similar but strict.

### 4. Build Tool: Vite
- **Decision**: Migrate to **Vite**.
- **Rationale**: 
  - Standard tooling for Vue 3.
  - Significant performance boost.
- **Changes**: 
  - `vue.config.js` -> `vite.config.js`.
  - `index.html` moves to root.
  - Environment variables prefix changes from `VUE_APP_` to `VITE_`.
  - `require` context (if used for mocks) needs replacement with `import.meta.glob`.

## Resolved Clarifications

- **Testing**: Vitest is chosen.
- **Vuetify**: Vuetify 3 is the target.
- **Charts**: vue-chartjs 5.x.
