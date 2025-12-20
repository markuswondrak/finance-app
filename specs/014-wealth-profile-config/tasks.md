# Tasks: Wealth Profile Configuration

**Feature Branch**: `014-wealth-profile-config`
**Spec**: [specs/014-wealth-profile-config/spec.md](../014-wealth-profile-config/spec.md)

## Phase 1: Setup
*Goal: Initialize project structure and ensure environment is ready for new feature implementation.*

- [x] T001 Verify backend environment and database connection settings in backend/.env
- [x] T002 Verify frontend environment and dependencies in frontend/package.json
- [x] T003 Create feature-specific API test file backend/tests/integration/wealth_profile_test.go (empty skeleton)

## Phase 2: Foundation (Blocking)
*Goal: Implement core backend entities and database schema changes required for all user stories.*

- [x] T004 Define WealthProfile struct in backend/internal/models/wealth_profile.go
- [x] T005 Add unique user_id index and foreign key constraints to WealthProfile model in backend/internal/models/wealth_profile.go
- [x] T006 Register WealthProfile model for GORM auto-migration in backend/internal/storage/db.go
- [x] T007 Run backend application to trigger auto-migration and verify wealth_profiles table creation

## Phase 3: User Story 1 - Configure Wealth Parameters (Priority: P1)
*Goal: Allow users to define and save their financial status and forecast expectations.*
*Independent Test: Can be tested by navigating to the new configuration section, entering values for all fields, saving, reloading the page, and verifying values are retained.*

### Backend Implementation
- [x] T008 [US1] Create storage interface method GetWealthProfile in backend/internal/storage/wealth_profile_repository.go
- [x] T009 [US1] Create storage interface method UpsertWealthProfile in backend/internal/storage/wealth_profile_repository.go
- [x] T010 [US1] Implement storage method GetWealthProfile in backend/internal/storage/postgres_wealth_profile_repository.go
- [x] T011 [US1] Implement storage method UpsertWealthProfile in backend/internal/storage/postgres_wealth_profile_repository.go
- [x] T012 [TDD] Create unit tests for wealth_profile_service.go (Mock Repository, Test Range Validation, Test Default Values)
- [x] T013 [P] [US1] Create service layer for wealth profile logic in backend/internal/services/wealth_profile_service.go
- [x] T014 [US1] Implement input validation logic (ranges and Worst<=Avg<=Best consistency) in backend/internal/services/wealth_profile_service.go
- [x] T015 [US1] Implement default value logic (return defaults if not found) in backend/internal/services/wealth_profile_service.go
- [x] T016 [TDD] Write integration tests for /api/wealth-profile endpoints in backend/tests/integration/wealth_profile_test.go
- [x] T017 [US1] Create HTTP handler GetWealthProfile in backend/internal/api/wealth_profile_handler.go
- [x] T018 [US1] Create HTTP handler UpsertWealthProfile in backend/internal/api/wealth_profile_handler.go
- [x] T019 [US1] Register new routes /api/wealth-profile (GET, PUT) in backend/internal/api/router.go

### Frontend Implementation
- [x] T020 [P] [US1] Create wealthService in frontend/src/services/wealthService.js with getProfile and updateProfile methods
- [x] T021 [TDD] Create component test spec for WealthConfigPanel.vue (Test rendering, validation error states)
- [x] T022 [P] [US1] Create Vue component WealthConfigPanel.vue in frontend/src/components/WealthConfigPanel.vue
- [x] T023 [US1] Implement v-expansion-panels layout in WealthConfigPanel.vue
- [x] T024 [US1] Add form fields (Current Wealth, Duration, Rates) to WealthConfigPanel.vue with v-model binding
- [x] T025 [US1] Implement client-side validation rules (ranges and Worst<=Avg<=Best) in WealthConfigPanel.vue
- [x] T026 [US1] Create page component WealthOverviewPage.vue in frontend/src/pages/WealthOverviewPage.vue
- [x] T027 [US1] Embed WealthConfigPanel in WealthOverviewPage.vue
- [x] T028 [US1] Add route /wealth-overview to frontend/src/router/index.js
- [x] T029 [US1] Add "Vermögensübersicht" link to main navigation in frontend/src/components/Navigation.vue (or equivalent)

### Integration & Verification
- [x] T030 [US1] Verify full flow: Navigate -> Open Panel -> Edit -> Save -> Refresh -> Verify Persistence
- [x] T031 [US1] Verify validation: Attempt invalid inputs (negative wealth, >100 years, Worst > Best) and check error handling
- [x] T032 [US1] Verify defaults: Create new user, visit page, ensure default values (10y, 3%/5%/7%) are displayed

## Phase 4: Polish & Cross-Cutting
*Goal: Refine UI/UX and ensure consistent error handling and loading states.*

- [x] T033 [P] Add loading skeletons/spinners to WealthConfigPanel.vue during data fetch/save
- [x] T034 Implement proper error notifications (Snackbar/Toast) for API failures in WealthConfigPanel.vue
- [x] T035 Ensure "Fintech Dark Mode" styling consistency (colors, shadows) across new components in frontend/src/finance.css
- [x] T036 Run full backend test suite to ensure no regressions
- [x] T037 Run frontend linting and fix any style issues

## Dependencies

- Phase 2 (DB Schema) MUST be completed before Phase 3 Backend tasks.
- Backend API tasks (T016-T019) MUST be completed before Frontend Integration (T030).
- Frontend Service (T020) can be implemented in parallel with Backend API.
- UI Components (T022-T025) can be implemented in parallel with Backend Logic using mock data initially.

## Implementation Strategy

1. **Foundation First**: Establish the DB schema and Go struct to ensure data shape is clear.
2. **TDD Backend**: Write service unit tests, then implement service with validation and defaults.
3. **API Exposure**: Write integration tests, then implement handlers.
4. **TDD Frontend**: Write component tests, then implement UI logic.
5. **Integration**: Verify the end-to-end flow including defaults and edge cases.