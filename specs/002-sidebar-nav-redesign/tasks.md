# Tasks: Sidebar Navigation Redesign

**Feature**: `002-sidebar-nav-redesign`
**Status**: Pending
**Input**: Plan from `specs/002-sidebar-nav-redesign/plan.md`

## Dependencies

- **Phase 1** (Setup) must be completed first.
- **Phase 2** (Foundation) blocks all user stories.
- **Phase 3** (US1) is independent.
- **Phase 4** (US2) depends on Phase 3 (extends `AppSidebar`).
- **Phase 5** (US3) depends on Phase 4 (extends `AppSidebar`).
- **Phase 6** (Polish) runs last.

## Implementation Strategy

We will replace the existing sidebar in `Layout.vue` with a new `AppSidebar` component. The implementation starts with a basic responsive drawer (Foundation), then adds the core navigation with the active state indicator (US1), followed by the branding header (US2), and finally the section organization (US3). Tests will be written for the component logic.

---

## Phase 1: Setup

*Goal: Initialize the component structure and test files.*

- [x] T001 Create directory `frontend/src/components/Navigation`
- [x] T002 Create component shell `frontend/src/components/Navigation/AppSidebar.vue`
- [x] T003 Create test file shell `frontend/src/tests/unit/components/Navigation/AppSidebar.spec.js`

## Phase 2: Foundation

*Goal: Implement the basic responsive sidebar component and integrate it into the layout.*
*Blocking: Must be done before specific features can be added.*

- [x] T004 [US1] Create initial unit test in `frontend/src/tests/unit/components/Navigation/AppSidebar.spec.js` to verify component renders
- [x] T005 [US1] Implement `v-navigation-drawer` in `frontend/src/components/Navigation/AppSidebar.vue` with `modelValue` and `rail` props
- [x] T006 [US1] Refactor `frontend/src/Layout.vue` to import `AppSidebar` and manage `drawer`/`rail` state based on viewport

## Phase 3: User Story 1 - Clear Navigation Location Indicator (P1)

*Goal: Users can clearly see which page they are on via a vertical accent bar.*
*Independent Test: Navigate to different pages; verify the active item has a vertical bar.*

- [x] T007 [US1] Add unit test to verify active class application in `frontend/src/tests/unit/components/Navigation/AppSidebar.spec.js`
- [x] T008 [US1] Define `navigationItems` data structure in `frontend/src/components/Navigation/AppSidebar.vue`
- [x] T009 [US1] Implement `v-list` rendering for navigation items in `frontend/src/components/Navigation/AppSidebar.vue`
- [x] T010 [US1] Implement custom active state CSS (vertical accent bar) using `::before` and ensure truncation logic in `frontend/src/components/Navigation/AppSidebar.vue`

## Phase 4: User Story 2 - App Branding in Navigation (P2)

*Goal: Show branding in the sidebar header and adapt for Rail mode.*
*Independent Test: Toggle between Desktop/Rail; verify logo centers and title hides.*

- [x] T011 [US2] Add unit test for branding rendering and rail mode visibility in `frontend/src/tests/unit/components/Navigation/AppSidebar.spec.js`
- [x] T012 [US2] Add branding header (Logo + Title) to `frontend/src/components/Navigation/AppSidebar.vue`
- [x] T013 [US2] Implement Rail mode logic in `frontend/src/components/Navigation/AppSidebar.vue` (hide title, center logo)
- [x] T014 [US2] Update `frontend/src/Layout.vue` to remove "Finanz-App" text from top bar (now in sidebar)

## Phase 5: User Story 3 - Organized Navigation Sections (P3)

*Goal: Group items into sections with headers that adapt to Rail mode.*
*Independent Test: Verify "Miscellaneous" header appears in expanded mode and disappears in Rail mode.*

- [x] T015 [US3] Add unit test for section header existence and visibility in `frontend/src/tests/unit/components/Navigation/AppSidebar.spec.js`
- [x] T016 [US3] Refactor data structure to support sections (Main vs Miscellaneous) in `frontend/src/components/Navigation/AppSidebar.vue`
- [x] T017 [US3] Implement `v-list-subheader` and `v-divider` for sections in `frontend/src/components/Navigation/AppSidebar.vue`
- [x] T018 [US3] Add logic to hide subheader text when `rail` prop is true in `frontend/src/components/Navigation/AppSidebar.vue`

## Phase 6: Polish & Cross-Cutting Concerns

*Goal: Final verification and cleanup.*

- [x] T019 Remove any unused legacy sidebar styles from `frontend/src/finance.css` or `frontend/src/Layout.vue`
- [x] T020 Manually verify responsive behavior (Mobile Drawer vs Desktop Rail) per `quickstart.md`
- [x] T021 Run full test suite `pnpm test` to ensure no regressions
- [x] T022 Implement Mint Green active state color
- [x] T023 Integrate `finapp_logo.png` into sidebar header
