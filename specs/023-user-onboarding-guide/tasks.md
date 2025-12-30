# Tasks: User Onboarding Guide

**Input**: Design documents from `/specs/023-user-onboarding-guide/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Required per Constitution (60% coverage mandate)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/internal/`
- **Frontend**: `frontend/src/`
- **Tests**: `backend/tests/`, `frontend/tests/`

---

## Phase 1: Setup

**Purpose**: Verify prerequisites and project structure

- [ ] T001 Verify onboarding images exist in frontend/src/assets/onboarding/ (7 images: welcome.png, overview.png, wealth.png, save-to-spend.png, fixed-costs.png, special-costs.png, navigation.png)
- [ ] T002 [P] Create help components directory at frontend/src/components/help/

---

## Phase 2: Foundational (Backend API)

**Purpose**: Backend infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No frontend work can begin until this phase is complete

### Backend Model & Repository

- [ ] T003 Add OnboardingCompleted field to User struct in backend/internal/user/model.go
- [ ] T004 Add UpdateOnboardingStatus method to UserRepository interface in backend/internal/storage/userRepo.go
- [ ] T005 Implement UpdateOnboardingStatus in UserRepoGorm in backend/internal/storage/userRepo.go

### Backend API Endpoint

- [ ] T006 Create OnboardingStatusRequest struct in backend/internal/user/api/handler.go
- [ ] T007 Implement UpdateOnboardingStatus handler in backend/internal/user/api/handler.go
- [ ] T008 Register PATCH /api/user/onboarding-status route in backend/internal/api/server.go

### Backend Tests

- [ ] T009 Create onboarding integration test file at backend/internal/user/api/handler_test.go
- [ ] T010 [P] Write test for successful onboarding status update (200 response)
- [ ] T011 [P] Write test for unauthorized request (401 response)
- [ ] T012 [P] Write test for invalid request body (400 response)

### Frontend Service

- [ ] T013 Add updateOnboardingStatus method to userService in frontend/src/services/user.js

**Checkpoint**: Backend API ready - run `go test ./backend/internal/user/api/...` to verify

---

## Phase 3: User Story 1 - First-Time User Discovers App Features (Priority: P1) 🎯 MVP

**Goal**: New users automatically see a welcome wizard on first login introducing all 5 main features

**Independent Test**: Create new user account → verify wizard appears → dismiss → verify it doesn't reappear on next login

### Implementation for User Story 1

- [ ] T014 [US1] Create OnboardingWizard.vue component skeleton in frontend/src/components/help/OnboardingWizard.vue
- [ ] T015 [US1] Define GUIDE_STEPS constant with 7 steps (welcome, overview, wealth, save-to-spend, fixed-costs, special-costs, navigation) in OnboardingWizard.vue
- [ ] T016 [US1] Implement v-dialog with v-window for step navigation in OnboardingWizard.vue
- [ ] T017 [US1] Add Next/Back/Skip buttons with proper navigation logic in OnboardingWizard.vue
- [ ] T018 [US1] Import and display screenshot images for each step in OnboardingWizard.vue
- [ ] T019 [US1] Call updateOnboardingStatus API on wizard complete or skip in OnboardingWizard.vue
- [ ] T020 [US1] Add auto-trigger logic to show wizard when user.onboarding_completed is false in frontend/src/App.vue
- [ ] T021 [US1] Emit close event and update local user state after wizard completion in App.vue

### Tests for User Story 1

- [ ] T022 [P] [US1] Create test file at frontend/tests/components/help/OnboardingWizard.test.js
- [ ] T023 [P] [US1] Write test: wizard renders all 7 steps
- [ ] T024 [P] [US1] Write test: Next button advances to next step
- [ ] T025 [P] [US1] Write test: Back button returns to previous step
- [ ] T026 [P] [US1] Write test: Skip button closes wizard and calls API
- [ ] T027 [P] [US1] Write test: Finish button on last step closes wizard and calls API

**Checkpoint**: User Story 1 complete - new users see wizard, can navigate steps, wizard doesn't reappear after dismissal

---

## Phase 4: User Story 2 - User Learns Feature Functions (Priority: P2)

**Goal**: Each wizard step provides detailed feature explanation with screenshot and key actions

**Independent Test**: Open wizard → navigate to any feature step → verify description, screenshot, and key actions are displayed

### Implementation for User Story 2

- [ ] T028 [US2] Add German descriptions for each feature in GUIDE_STEPS constant in OnboardingWizard.vue
- [ ] T029 [US2] Add keyActions array for each feature step in GUIDE_STEPS constant in OnboardingWizard.vue
- [ ] T030 [US2] Style step content layout: title, icon, description, screenshot, key actions list in OnboardingWizard.vue
- [ ] T031 [US2] Add responsive styling for mobile viewport in OnboardingWizard.vue

### Tests for User Story 2

- [ ] T032 [P] [US2] Write test: each step displays correct title and icon
- [ ] T033 [P] [US2] Write test: each step displays screenshot image
- [ ] T034 [P] [US2] Write test: feature steps display key actions list

**Checkpoint**: User Story 2 complete - all feature explanations are detailed and visually clear

---

## Phase 5: User Story 3 - User Accesses Help On-Demand (Priority: P3)

**Goal**: Users can access the guide anytime via Help section in sidebar navigation

**Independent Test**: Log in as existing user → click Help in sidebar → verify guide opens

### Implementation for User Story 3

- [ ] T035 [US3] Create HelpPage.vue component in frontend/src/components/help/HelpPage.vue
- [ ] T036 [US3] Add "Anleitung starten" button to open OnboardingWizard in HelpPage.vue
- [ ] T037 [US3] Add /help route to router in frontend/src/router/index.js
- [ ] T038 [US3] Add Help navigation item to AppSidebar in frontend/src/components/navigation/AppSidebar.vue
- [ ] T039 [US3] Use fa-circle-question icon for Help nav item in AppSidebar.vue

### Tests for User Story 3

- [ ] T040 [P] [US3] Write test: HelpPage renders with guide button
- [ ] T041 [P] [US3] Write test: clicking button opens OnboardingWizard
- [ ] T042 [P] [US3] Write test: Help appears in sidebar navigation

**Checkpoint**: User Story 3 complete - Help section accessible in sidebar, wizard opens on-demand

---

## Phase 6: User Story 4 - User Understands Navigation (Priority: P4)

**Goal**: Final wizard step explains sidebar navigation including mobile menu

**Independent Test**: Open wizard → navigate to last step → verify navigation instructions are clear

### Implementation for User Story 4

- [ ] T043 [US4] Enhance navigation step content with sidebar expansion instructions in OnboardingWizard.vue
- [ ] T044 [US4] Add mobile hamburger menu instructions to navigation step in OnboardingWizard.vue
- [ ] T045 [US4] Add "Hilfe jederzeit aufrufen" instruction pointing to new Help section in OnboardingWizard.vue

### Tests for User Story 4

- [ ] T046 [P] [US4] Write test: navigation step displays sidebar instructions
- [ ] T047 [P] [US4] Write test: navigation step displays mobile menu instructions

**Checkpoint**: User Story 4 complete - navigation guidance is comprehensive

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks and improvements

- [ ] T048 Run all backend tests: go test ./backend/...
- [ ] T049 Run all frontend tests: cd frontend && npm test
- [ ] T050 Verify responsive design on mobile viewport (320px-768px)
- [ ] T051 Verify wizard loads in under 100ms (performance goal)
- [ ] T052 Manual test: full onboarding flow for new user
- [ ] T053 Manual test: Help section access for existing user
- [ ] T054 Code review: check for German language consistency in all wizard content

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 must complete before US2 (US2 enhances US1's wizard)
  - US3 can run parallel to US1/US2 (independent Help page)
  - US4 depends on US1 (enhances wizard's navigation step)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 2 (Foundational)
        │
        ▼
   ┌────┴────┐
   │         │
   ▼         ▼
  US1       US3 (parallel)
   │
   ▼
  US2
   │
   ▼
  US4
   │
   ▼
Phase 7 (Polish)
```

### Parallel Opportunities

**Within Phase 2 (Backend):**
- T010, T011, T012 can run in parallel (different test cases)

**Within Phase 3 (US1 Tests):**
- T022-T027 can run in parallel (different test cases)

**Across User Stories:**
- US3 (Help page) can be developed in parallel with US1/US2

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all US1 tests together:
Task: "Write test: wizard renders all 7 steps" [T023]
Task: "Write test: Next button advances to next step" [T024]
Task: "Write test: Back button returns to previous step" [T025]
Task: "Write test: Skip button closes wizard and calls API" [T026]
Task: "Write test: Finish button on last step closes wizard and calls API" [T027]
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (Backend API)
3. Complete Phase 3: User Story 1 (Basic wizard)
4. **STOP and VALIDATE**: Test with new user account
5. Deploy/demo if ready - basic onboarding works!

### Incremental Delivery

1. Setup + Foundational → Backend API ready
2. Add User Story 1 → Basic wizard works → Deploy (MVP!)
3. Add User Story 2 → Rich content → Deploy
4. Add User Story 3 → Help section → Deploy
5. Add User Story 4 → Navigation guide → Deploy
6. Polish → Production ready

### Recommended Order for Solo Developer

1. T001-T002 (Setup)
2. T003-T013 (Foundational - backend first)
3. T014-T027 (US1 - core wizard)
4. T028-T034 (US2 - content)
5. T035-T042 (US3 - Help page)
6. T043-T047 (US4 - navigation)
7. T048-T054 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Constitution requires 60% test coverage - tests included
- All wizard content must be in German
- Images are already in place (verified in T001)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
