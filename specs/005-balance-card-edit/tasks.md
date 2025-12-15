# Tasks: Current Balance Card with Click-to-Edit

**Feature**: `005-balance-card-edit`
**Status**: Pending

## Phase 1: Setup
> Goal: Ensure project environment is ready for implementation.

- [x] T001 Verify Go environment and dependencies
- [x] T002 Verify Node/npm environment and dependencies

## Phase 2: Foundational
> Goal: Implement core backend structures and frontend services required for the feature. Must complete before User Stories.

**Backend**
- [x] T003 [P] Create `User` struct in `backend/internal/models/user.go`
- [x] T004 [P] Create `UserRepository` interface and implementation in `backend/internal/storage/userRepo.go`
- [x] T005 [P] Create `backend/internal/api/user_test.go` with initial test cases
- [x] T006 Implement `UpdateCurrentAmount` handler in `backend/internal/api/user.go`
- [x] T007 Register `PUT /user/current-amount` route in `backend/internal/api/server.go`
- [x] T008 Update `createOverview` in `backend/internal/api/overview.go` to use `UserRepository` for `CurrentAmount`

**Frontend**
- [x] T009 [P] Create `frontend/src/services/user.js` with `updateCurrentAmount` function

## Phase 3: User Story 1 - Update Current Balance
> Goal: Enable users to update their starting capital via a click-to-edit card.
> **Priority**: P1

**Tests**
- [x] T010 [P] [US1] Create `frontend/tests/unit/components/CurrentBalanceCard.spec.js`
- [x] T011 [P] [US1] Create `frontend/tests/unit/components/BalanceEditModal.spec.js`

**Implementation**
- [x] T012 [US1] Create `BalanceEditModal.vue` component in `frontend/src/components/dashboard/BalanceEditModal.vue`
- [x] T013 [US1] Create `CurrentBalanceCard.vue` component in `frontend/src/components/dashboard/CurrentBalanceCard.vue`
- [x] T014 [US1] Implement "Click to Open Modal" logic in `CurrentBalanceCard.vue`
- [x] T015 [US1] Implement "Save" logic in `BalanceEditModal.vue` calling `userService.updateCurrentAmount`
- [x] T016 [US1] Integrate `CurrentBalanceCard` into `frontend/src/views/Home.vue` (or `Overview.vue`)
- [x] T017 [US1] Implement event emission/handling to refresh forecast chart after save (re-fetch Overview)
- [x] T018 [US1] Rename "Current Balance" to "Monthly Sum" in `frontend/src/components/FixedCosts.vue` (FR-011)
- [x] T024 [US1] Implement error handling for forecast recalculation failures in frontend/src/services/user.js and frontend/src/components/dashboard/CurrentBalanceCard.vue
- [x] T025 [US1] Ensure frontend validation provides "immediate, helpful feedback" in BalanceEditModal.vue

## Phase 4: User Story 2 - Display Current Balance Prominently
> Goal: Ensure the balance is displayed clearly and prominently.
> **Priority**: P2

- [x] T019 [US2] Update `CurrentBalanceCard.vue` to use large, bold typography for the amount
- [x] T020 [US2] Apply currency formatting to the displayed amount in `CurrentBalanceCard.vue`
- [x] T021 [US2] Add visual edit indicator (pencil icon) to `CurrentBalanceCard.vue`

## Phase 5: User Story 3 - Cancel Balance Edit
> Goal: Allow users to safely cancel the edit operation.
> **Priority**: P3

- [x] T022 [US3] Implement "Cancel" button logic in `BalanceEditModal.vue`
- [x] T023 [US3] Implement "Close on Escape" and "Close on Click Outside" behavior in `BalanceEditModal.vue`

## Dependencies

1. Phase 2 (Foundational) MUST be completed before Phase 3 (US1).
2. Phase 3 (US1) is the MVP.
3. Phase 4 (US2) and Phase 5 (US3) can be implemented in parallel after Phase 3.

## Implementation Strategy

- Start with Backend Foundational tasks (Models, Repo, API) to establish the contract.
- Then move to Frontend Foundational (Service).
- Implement US1 to get the core "Update" loop working.
- Polish with US2 (Visuals) and US3 (UX/Safety).
