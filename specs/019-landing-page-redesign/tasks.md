# Tasks: Redesign Landing Page

**Feature Branch**: `019-landing-page-redesign`
**Spec**: [specs/019-landing-page-redesign/spec.md](spec.md)
**Status**: Planned

## Phase 1: Setup & Infrastructure
*Goal: Initialize component structure and verify routing configuration.*

- [ ] T001 Create component directory `frontend/src/components/landing/`
- [ ] T002 Create scaffold for `LandingPage.vue` in `frontend/src/components/landing/LandingPage.vue`
- [ ] T003 Create scaffold for `LandingHero.vue` in `frontend/src/components/landing/LandingHero.vue`
- [ ] T004 Create scaffold for `WealthFeature.vue` in `frontend/src/components/landing/WealthFeature.vue`
- [ ] T005 Create scaffold for `SavingsCalculator.vue` in `frontend/src/components/landing/SavingsCalculator.vue`
- [ ] T006 Create scaffold for `LandingFooter.vue` in `frontend/src/components/landing/LandingFooter.vue`
- [ ] T007 Verify `frontend/src/router/index.js` correctly points `/` to `LandingPage.vue` with `meta: { hideNavigation: true, guestOnly: true }`

## Phase 2: User Story 1 - German "Made in EU" Landing Page
*Goal: Create the visual layout with German content, "Made in EU" badge, and Wealth Management section. Ensure responsive behavior.*
*Independent Test: Load `/`, verify German text, "Made in EU" badge, Wealth section, and absence of header on mobile.*

- [ ] T008 [P] [US1] Implement `LandingHero.vue` layout with "Made in EU" badge (in Hero section) and German headlines in `frontend/src/components/landing/LandingHero.vue`
- [ ] T009 [P] [US1] Implement `WealthFeature.vue` with German marketing copy describing Wealth Management features in `frontend/src/components/landing/WealthFeature.vue`
- [ ] T010 [P] [US1] Implement `LandingFooter.vue` with "Impressum" and "Datenschutz" links in `frontend/src/components/landing/LandingFooter.vue`
- [ ] T011 [US1] Assemble components in `frontend/src/components/landing/LandingPage.vue` and apply responsive layout rules
- [ ] T012 [US1] Verify and adjust `frontend/src/App.vue` (or Layout component) to ensure the global application header is hidden when `meta.hideNavigation` is true, especially on mobile

## Phase 3: User Story 2 - Google Login Entry
*Goal: Provide a single, distinct entry point via Google Login.*
*Independent Test: Verify "Login with Google" button exists and triggers the auth flow.*

- [ ] T013 [US2] Add "Login with Google" button to `frontend/src/components/landing/LandingHero.vue`
- [ ] T014 [US2] Connect Login button to `AuthService` login method (triggers Google Auth flow) in `frontend/src/components/landing/LandingHero.vue`
- [ ] T015 [US2] Verify no other login forms exist on the landing page

## Phase 4: User Story 3 - Savings Calculator Gimmick
*Goal: Implement the interactive savings calculator with chart visualization.*
*Independent Test: Enter values (200€, 5%, 15 years), verify chart updates and final value displays correctly.*

- [ ] T016 [P] [US3] Implement calculation logic (Compound Interest) in `frontend/src/components/landing/SavingsCalculator.vue`
- [ ] T017 [P] [US3] Implement UI inputs (Monthly Savings, Return Rate, Years Toggle: 15/20/25) in `frontend/src/components/landing/SavingsCalculator.vue`
- [ ] T018 [US3] Implement Chart.js `Line` chart integration for growth curve visualization in `frontend/src/components/landing/SavingsCalculator.vue`
- [ ] T019 [US3] Add `SavingsCalculator.vue` to `frontend/src/components/landing/LandingPage.vue` layout

## Phase 5: Polish & Cross-Cutting Concerns
*Goal: Final visual tweaks and performance verification.*

- [ ] T020 Verify all text is 100% German and check for typos in `frontend/src/components/landing/`
- [ ] T021 Verify responsive design on small screens (mobile view) - Ensure content stacking and padding is correct
- [ ] T022 Verify "Made in EU" badge visibility and styling (Prominent in Hero)

## Dependencies

1. **Phase 1** (Setup) must complete before all others.
2. **Phase 2, 3, 4** can technically be developed in parallel as they touch different sub-components, but integration happens in `LandingPage.vue`.
3. **T016/T017** (Logic/Inputs) should be done before **T018** (Chart) for easier testing.

## Implementation Strategy

- **MVP**: Complete Phase 1 & 2 to have a visual landing page.
- **Increment 1**: Add Phase 3 (Login) to make it functional.
- **Increment 2**: Add Phase 4 (Calculator) for the full feature set.
