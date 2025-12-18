# Tasks: Landing Page

**Feature Branch**: `011-landing-page`
**Status**: Draft

## Phase 1: Setup & Routing (Project Initialization)

**Goal**: Establish the file structure and routing logic to serve the landing page at the root while protecting dashboard routes.

- [x] T001 Create component directory structure in `frontend/src/components/landing/`
- [x] T002 Create page component file `frontend/src/pages/LandingPage.vue`
- [x] T003 Update router configuration in `frontend/src/router/index.js` to set `LandingPage` as root path `/`
- [x] T004 Implement navigation guard in `frontend/src/router/index.js` to redirect authenticated users from `/` to `/overview`
- [x] T005 Create unit test for route guard logic in `frontend/tests/unit/router/guard.spec.js`

## Phase 2: Foundational Styles (Blocking Prerequisites)

**Goal**: Implement the core visual language (Glassmorphism, Animations, Theme) required by all sections.

- [x] T006 Define glassmorphism utility class `.glass-card` in `frontend/src/finance.css`
- [x] T007 Define scroll animation classes (`.fade-in-up`, `.visible`) in `frontend/src/finance.css`
- [x] T008 [P] Implement `IntersectionObserver` directive or composable for scroll animations in `frontend/src/composables/useIntersectionObserver.js`
- [x] T009 Verify "Fintech Dark" theme colors (Deep Black #0a0a0a, Neon Green #2ecc71) are available in Vuetify theme config

## Phase 3: App Discovery & Onboarding (User Story 1)

**Goal**: Implement the Hero section with 3D chart visualization and signup call-to-actions.

- [x] T010 [US1] Create `HeroSection.vue` component in `frontend/src/components/landing/HeroSection.vue`
- [x] T011 [P] [US1] Implement 3D tilt effect using CSS `transform: perspective` in `HeroSection.vue`
- [x] T012 [US1] Integrate Chart.js line chart with "drawing" animation config in `HeroSection.vue` using mock data
- [x] T013 [P] [US1] Add placeholder "Sign up with Google" and "Sign up with GitHub" buttons to `HeroSection.vue`
- [x] T014 [US1] Create component test for Hero rendering and interactions in `frontend/tests/unit/landing/HeroSection.spec.js`
- [x] T015 [US1] Integrate `HeroSection` into `frontend/src/pages/LandingPage.vue`

## Phase 4: Value Exploration (User Story 2)

**Goal**: specific feature highlights and the interactive "Lowest Balance" preview widget.

- [x] T016 [US2] Create `FeatureGrid.vue` component in `frontend/src/components/landing/FeatureGrid.vue`
- [x] T017 [US2] Implement feature cards using `.glass-card` style and scroll animations in `FeatureGrid.vue`
- [x] T018 [US2] Create `InteractivePreview.vue` component in `frontend/src/components/landing/InteractivePreview.vue`
- [x] T019 [US2] Import existing `LowestPointCard` component into `InteractivePreview.vue` and bind with hardcoded mock data
- [x] T020 [US2] Create component test for FeatureGrid rendering in `frontend/tests/unit/landing/FeatureGrid.spec.js`
- [x] T021 [US2] Integrate `FeatureGrid` and `InteractivePreview` into `frontend/src/pages/LandingPage.vue`

## Phase 5: Future Roadmap & Final CTA (User Story 3)

**Goal**: Build trust with a roadmap teaser and provide a final conversion opportunity in the footer.

- [x] T022 [US3] Create `RoadmapTeaser.vue` component in `frontend/src/components/landing/RoadmapTeaser.vue`
- [x] T023 [US3] Implement dimmed "Coming Soon" styling for roadmap items in `RoadmapTeaser.vue`
- [x] T024 [US3] Create `LandingFooter.vue` component in `frontend/src/components/landing/LandingFooter.vue`
- [x] T025 [P] [US3] Add links (Terms, Privacy, Back to Top) and social icons to `LandingFooter.vue`
- [x] T026 [US3] Integrate `RoadmapTeaser` and `LandingFooter` into `frontend/src/pages/LandingPage.vue`

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Ensure responsiveness, performance, and visual consistency across all devices.

- [x] T027 Refine responsiveness of 3D tilt effect (disable/reduce on mobile) in `HeroSection.vue`
- [x] T028 Audit glassmorphism contrast and legibility on mobile devices
- [x] T029 Run Google Lighthouse audit and optimize for >90 score (lazy loading images/components)
- [x] T030 Verify all scroll animations trigger correctly on different screen heights

## Implementation Strategy

- **MVP Scope**: Phases 1, 2, and 3 (Hero Section) deliver the core value proposition.
- **Incremental Delivery**: Feature Grid (Phase 4) and Roadmap (Phase 5) can be released sequentially.
- **Parallelization**: Component implementation within phases can generally be parallelized once foundational styles (Phase 2) are set.

## Dependencies

1. **Phase 1** must be completed first to establish the page container.
2. **Phase 2** (Styles) blocks the visual implementation of Phases 3, 4, and 5.
3. **Phase 4** depends on the existence of `LowestPointCard` (already in codebase).