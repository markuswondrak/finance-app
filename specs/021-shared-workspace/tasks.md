# Tasks: Shared Finance Workspace

## Phase 1: Setup
- [x] T001 Create migration for `workspaces` table and `workspace_users` junction table in `backend/internal/models/workspace.go`
- [x] T002 Create migration for `invites` table in `backend/internal/models/invite.go`
- [x] T003 Update `User` model to include `workspace_id` in `backend/internal/models/user.go`
- [x] T004 Update `FixedCost` model to include `workspace_id` in `backend/internal/models/fixed_cost.go`
- [x] T005 Create data migration script to backfill existing users into default workspaces in `backend/internal/storage/migrations/001_backfill_workspaces.go`
- [x] T006 Configure Mailjet API keys in `backend/.env` and `backend/internal/services/email_service.go`

## Phase 2: Foundational
- [x] T007 Implement `WorkspaceService` for creation and retrieval in `backend/internal/services/workspace_service.go`
- [x] T008 Implement `InviteService` for token generation and validation in `backend/internal/services/invite_service.go`
- [x] T009 Update `AuthMiddleware` to inject `workspace_id` into context in `backend/internal/api/middleware/auth.go`
- [x] T010 [P] Implement `SendInviteEmail` function using `backend/templates/invite_email.html` in `backend/internal/services/email_service.go`
- [x] T011 Create `WorkspaceRepository` interface and implementation in `backend/internal/storage/workspace_repository.go`
- [x] T012 Create `InviteRepository` interface and implementation in `backend/internal/storage/invite_repository.go`

## Phase 3: Create and Join Workspace (P1)
**Goal**: Users can generate invites and others can join via link.
**Independent Test**: Generate token, use with new user, verify shared access.

- [x] T037 [US1] Create integration test for Invite creation and joining flow in `backend/tests/integration/invite_test.go`
- [x] T013 [US1] Create `POST /api/workspaces/invite` endpoint in `backend/internal/api/workspace_handler.go`
- [x] T014 [US1] Create `POST /api/workspaces/join` endpoint in `backend/internal/api/workspace_handler.go`
- [x] T015 [US1] Create `WorkspaceService` frontend client in `frontend/src/services/workspaceService.js`
- [x] T016 [US1] Add "Invite Member" button and modal to `frontend/src/components/settings/UserSettingsPage.vue`
- [x] T017 [US1] Create invite handling route `/invite/:token` in `frontend/src/router/index.js`
- [x] T018 [US1] Implement `InviteLandingPage` component in `frontend/src/components/settings/InviteLandingPage.vue`

## Phase 4: Destructive Join Warning (P1)
**Goal**: Prevent accidental data loss when joining a workspace.
**Independent Test**: Invite user with data, verify warning, confirm, verify data purge.

- [x] T038 [US2] Create integration test for destructive join warning and data purge in `backend/tests/integration/workspace_join_test.go`
- [x] T019 [US2] Implement `HasExistingData` check in `backend/internal/services/user_service.go`
- [x] T020 [US2] Update `POST /api/workspaces/join` to return warning if data exists in `backend/internal/api/workspace_handler.go`
- [x] T021 [US2] Implement `PurgeUserData` function in `backend/internal/services/workspace_service.go`
- [x] T022 [US2] Add `force=true` parameter handling to `POST /api/workspaces/join` in `backend/internal/api/workspace_handler.go`
- [x] T023 [US2] Create `DestructiveJoinModal` component in `frontend/src/components/settings/DestructiveJoinModal.vue`
- [x] T024 [US2] Integrate warning modal into `InviteLandingPage` flow in `frontend/src/components/settings/InviteLandingPage.vue`

## Phase 5: Peer-to-Peer Management (P2)
**Goal**: All members have equal read/write access.
**Independent Test**: Joined user adds cost, original user sees it.

- [x] T039 [US3] Create integration test for peer-to-peer access rights in `backend/tests/integration/workspace_access_test.go`
- [x] T025 [P] [US3] Update `FixedCostService` to use `workspace_id` for queries in `backend/internal/services/fixed_cost_service.go`
- [x] T026 [P] [US3] Update `WealthProfileService` to use `workspace_id` for queries in `backend/internal/services/wealth_profile_service.go`
- [x] T027 [US3] Display list of workspace members in `frontend/src/components/settings/UserSettingsPage.vue`
- [x] T028 [US3] Verify shared visibility of Dashboard data in `frontend/src/components/Dashboard.vue` (Backend update usually sufficient, manual verification)

## Phase 6: Offboarding and Revocation (P3)
**Goal**: Securely remove members and revoke access.
**Independent Test**: Remove user, verify API 403, verify empty state on login.

- [x] T040 [US4] Create integration test for member removal and access revocation in `backend/tests/integration/workspace_revocation_test.go`
- [x] T029 [US4] Create `DELETE /api/workspaces/members/:id` endpoint in `backend/internal/api/workspace_handler.go`
- [x] T030 [US4] Implement `RemoveMember` logic (reset `workspace_id` to new empty workspace) in `backend/internal/services/workspace_service.go`
- [x] T031 [US4] Add "Remove" button to member list in `frontend/src/components/settings/UserSettingsPage.vue`
- [x] T041 [US4] Add "Leave Workspace" button and confirmation modal to `frontend/src/components/settings/UserSettingsPage.vue`
- [x] T032 [US4] Implement immediate token revocation/session invalidation (if applicable) or rely on db check in `backend/internal/api/middleware/auth.go`

## Phase 7: Polish & Cross-Cutting
- [x] T033 Handle expired invite tokens gracefully in `frontend/src/components/settings/InviteLandingPage.vue`
- [x] T034 Ensure "Last Write Wins" behavior is consistent (mostly GORM default, verify no locking issues)
- [x] T035 Apply Fintech Dark Mode styles to new components in `frontend/src/finance.css`
- [x] T036 Run full regression test suite on Fixed Costs and Wealth Profile features

## Dependencies
- US1 (Create/Join) depends on Setup & Foundational
- US2 (Destructive Join) depends on US1
- US3 (P2P) depends on US1 (shared access logic)
- US4 (Offboarding) depends on US1 & US3

## Implementation Strategy
- **MVP**: Setup + Foundational + US1 + US3 (Basic sharing).
- **Increment 2**: US2 (Safety features).
- **Increment 3**: US4 (Management & Security).
