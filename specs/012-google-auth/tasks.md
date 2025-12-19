# Tasks: Google Authentication

**Feature Branch**: `012-google-auth`
**Feature Spec**: [specs/012-google-auth/spec.md](../specs/012-google-auth/spec.md)

## Phase 1: Setup

Goal: Initialize dependencies and configuration for OAuth and JWT.

- [x] T001 Install Go dependencies (oauth2, jwt, gin) in `backend/go.mod`
- [x] T002 Configure environment variables (GOOGLE_CLIENT_ID, SECRET, etc.) in `backend/.env`
- [x] T003 Install Vue.js dependency `vue3-google-login` in `frontend/package.json`

## Phase 2: Foundational

Goal: Create the User entity and basic Auth API structure (blocking for all stories).

- [x] T004 Create User entity model in `backend/internal/models/user.go`
- [x] T005 Create unit test for User repository in `backend/internal/storage/user_repository_test.go`
- [x] T006 Implement User repository (Create, GetByEmail, GetByID) in `backend/internal/storage/user_repository.go`
- [x] T007 Run database migration to create `users` table in `backend/db/migrations/`
- [x] T008 Create unit test for JWT utility functions in `backend/internal/api/auth/jwt_test.go`
- [x] T009 Implement JWT utility functions (Generate with 24h expiry, Validate) in `backend/internal/api/auth/jwt.go`
- [x] T010 [P] Scaffold Auth API handlers (Login, Callback, Me, Logout) in `backend/internal/api/auth/handlers.go`
- [x] T011 Register Auth routes in `backend/main.go`

## Phase 3: User Story 1 & 2 - Registration & Login

Goal: Enable users to sign in with Google and establish a session.

**Independent Test**: User can click "Login", authenticate with Google, and see their profile data returned by `/auth/me`.

- [x] T012 [US1] Create unit tests for Auth Handlers (Login, Callback, Me) in `backend/internal/api/auth/handlers_test.go`
- [x] T013 [US1] Implement `Login` handler (Redirect to Google with email/profile scopes) in `backend/internal/api/auth/handlers.go`
- [x] T014 [US1] Implement `Callback` handler (Exchange code, Get Profile, Create/Update User) in `backend/internal/api/auth/handlers.go`
- [x] T015 [US1] Implement `Callback` handler (Set HTTP-only Cookie) in `backend/internal/api/auth/handlers.go`
- [x] T016 [US1] Implement `Me` handler (Return user profile from context/cookie) in `backend/internal/api/auth/handlers.go`
- [x] T017 [US1] Add "Log in with Google" and "Register" buttons to `frontend/src/pages/LandingPage.vue`
- [x] T018 [P] [US1] Implement frontend AuthService (checkAuth, login, logout) in `frontend/src/services/auth.js`
- [x] T019 [US1] Create UserMenu component (Avatar with fallback + Logout) in `frontend/src/components/UserMenu.vue`
- [x] T020 [US1] Integrate UserMenu into main layout in `frontend/src/Layout.vue`

## Phase 4: User Story 3 - Access Control

Goal: Protect sensitive routes from unauthenticated access.

**Independent Test**: Unauthenticated access to `/overview` redirects to `/`.

- [x] T021 [US3] Create unit test for Auth Middleware in `backend/internal/api/middleware/auth_test.go`
- [x] T022 [US3] Implement Auth Middleware (Verify JWT cookie) in `backend/internal/api/middleware/auth.go`
- [x] T023 [US3] Apply Auth Middleware to protected API groups in `backend/main.go`
- [x] T024 [P] [US3] Implement Vue Router navigation guard (Protect routes + Redirect auth users from /login) in `frontend/src/router/index.js`
- [x] T025 [US3] Update Router configuration to mark protected routes in `frontend/src/router/index.js`

## Phase 5: User Story 4 - Data Isolation

Goal: Ensure users only see their own data.

**Independent Test**: User A cannot see User B's costs.

- [x] T026 [US4] Update FixedCost model (Add UserID) in `backend/internal/models/fixed_cost.go`
- [x] T027 [US4] Update SpecialCost model (Add UserID) in `backend/internal/models/special_cost.go`
- [x] T028 [US4] Run database migration to add `user_id` column to costs tables in `backend/db/migrations/`
- [x] T029 [US4] Create/Update unit tests for FixedCost repository (Filter by UserID) in `backend/internal/storage/fixed_cost_repository_test.go`
- [x] T030 [US4] Update FixedCost repository (Filter by UserID) in `backend/internal/storage/fixed_cost_repository.go`
- [x] T031 [US4] Create/Update unit tests for SpecialCost repository (Filter by UserID) in `backend/internal/storage/special_cost_repository_test.go`
- [x] T032 [US4] Update SpecialCost repository (Filter by UserID) in `backend/internal/storage/special_cost_repository.go`
- [x] T033 [US4] Update API handlers to inject UserID from context into repositories in `backend/internal/api/handlers.go`

## Phase 6: Polish

Goal: Refine UX and error handling.

- [x] T034 Implement graceful error handling for OAuth failures (Service Down, Revoked) in `backend/internal/api/auth/handlers.go`
- [x] T035 Add loading state to Login buttons in `frontend/src/pages/LandingPage.vue`
- [x] T036 Implement Logout handler (Clear cookie) in `backend/internal/api/auth/handlers.go`

## Dependencies

- Phase 2 (Foundational) MUST complete before Phase 3, 4, 5.
- T014 (Callback logic) depends on T004, T006, T009.
- T028 (Cost migrations) MUST complete before T030, T032.

## Parallel Execution Examples

- T018 (Frontend Auth Service) can be built while T012-T016 (Backend Auth) are in progress.
- T026/T027 (Models) and T024 (Frontend Guards) can be done in parallel with T017-T020 (Login UI).

## Implementation Strategy

1. **MVP**: Setup + Foundational + Phase 3 (Login Flow). Result: Users can log in and see their avatar.
2. **Security**: Phase 4 (Access Control). Result: Routes are protected.
3. **Multi-tenancy**: Phase 5 (Data Isolation). Result: Full feature complete.
