# Tasks: Upgrade Vue 2 to Vue 3

**Feature**: `003-upgrade-vue-3`
**Status**: Completed

## Phase 1: Setup
*Goal: Initialize Vite environment and remove legacy build tools.*

- [x] T001 Move `frontend/public/index.html` to `frontend/index.html` and update script injection for Vite in `frontend/index.html`
- [x] T002 Create `frontend/vite.config.js` with Vue and Vuetify plugins
- [x] T003 Update `frontend/package.json` to remove Vue CLI/Webpack dependencies and add Vite/Vue 3 dependencies
- [x] T004 Clean up legacy configuration files (`frontend/vue.config.js`, `frontend/babel.config.js`)

## Phase 2: Foundations
*Goal: Establish the core application runtime with Vue 3.*

- [x] T005 Install all new dependencies in `frontend/`
- [x] T006 Update `frontend/src/main.js` to use Vue 3 `createApp` mounting logic
- [x] T007 Update `frontend/src/plugins/vuetify.js` to initialize Vuetify 3 with `createVuetify`
- [x] T008 Update Router configuration in `frontend/src/main.js` (or separate router file) to use Vue Router 4 (`createRouter`, `createWebHistory`)

## Phase 3: Seamless Application Usage (US1)
*Goal: Ensure all application features work exactly as before.*

- [x] T009 [P] [US1] Update `frontend/src/App.vue` template and script for Vue 3 compatibility
- [x] T010 [P] [US1] Update `frontend/src/Layout.vue` layout components to Vuetify 3 syntax
- [x] T011 [P] [US1] Migrate `frontend/src/components/FixedCostTable.vue` to use `v-data-table` from Vuetify 3
- [x] T012 [P] [US1] Migrate `frontend/src/components/SpecialCosts.vue` components to Vuetify 3
- [x] T013 [P] [US1] Update `frontend/src/components/overview/OverviewChart.vue` to use `vue-chartjs` 5.x and Chart.js 4.x
- [x] T014 [P] [US1] Migrate `frontend/src/components/overview/OverviewTable.vue` to Vuetify 3
- [x] T015 [P] [US1] Update `frontend/src/components/editform/CostEditForm.vue` and related form components to Vuetify 3 validation and inputs
- [x] T016 [US1] Verify and update Global CSS in `frontend/src/finance.css` if impacted by Vuetify 3 variable changes

## Phase 4: Modern Developer Experience (US2)
*Goal: Enable modern testing and build workflows.*

- [x] T017 [US2] Configure Vitest in `frontend/vite.config.js`
- [x] T018 [US2] Update `frontend/package.json` test scripts to run Vitest
- [x] T019 [P] [US2] Migrate utility tests in `frontend/tests/unit/components/Utils.spec.js` to Vitest
- [x] T020 [P] [US2] Migrate component tests in `frontend/tests/unit/components/FixedCostTable.spec.js` to `vue-test-utils` v2
- [x] T021 [P] [US2] Migrate component tests in `frontend/tests/unit/components/overview/OverviewChart.spec.js`
- [x] T022 [P] [US2] Migrate remaining tests in `frontend/tests/unit/` to match new component implementations

## Phase 5: Polish & Cross-Cutting
*Goal: Final cleanup and verification.*

- [x] T023 Verify production build with `pnpm run build` in `frontend/`
- [x] T024 Check for and remove any unused Vue 2 specific polyfills or libraries (removed `core-js`)
- [x] T025 Update README.md in `frontend/` with new commands

## Dependencies

1. **Setup** (T001-T004) MUST complete first.
2. **Foundations** (T005-T008) MUST complete before any User Story work.
3. **US1** (T009-T016) and **US2** (T017-T022) can technically run in parallel, but it is recommended to finish US1 (App Code) before fixing US2 (Tests) to ensure tests match the new implementation.

## Parallel Execution Examples

- **UI Migration**: T011 (Fixed Costs), T012 (Special Costs), and T013 (Charts) affect different files and can be done by different developers simultaneously once Phase 2 is done.
- **Test Migration**: T019, T020, and T021 can be executed in parallel once Vitest is configured (T017).

## Implementation Strategy

We will perform a "Big Bang" migration of the runtime dependencies (Phase 1 & 2) because Vue 2 and Vue 3 cannot easily coexist in the same entry point. Once the app mounts (T006), we will systematically fix the broken components (Phase 3). Finally, we will restore the test suite (Phase 4).
