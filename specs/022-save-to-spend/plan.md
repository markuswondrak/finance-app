# Implementation Plan: Save-To-Spend

**Feature**: `022-save-to-spend`
**Status**: Implemented

## Phase 1: Backend Foundation

- [x] **Database Migrations**
    - Create `monthly_payment_statuses` table.
    - Create `one_time_pending_costs` table.
    - Add `save_to_spend_balance` column to `workspaces` table.

- [x] **Repository Layer (`internal/spend/repository`)**
    - Implement `CreatePaymentStatus`, `UpdatePaymentStatus`, `GetPaymentStatus`.
    - Implement `CreateOneTimeCost`, `UpdateOneTimeCost`, `DeleteOneTimeCost`, `GetOneTimeCosts`.
    - Implement `UpdateSaveToSpendBalance`.

- [x] **Service Layer (`internal/spend/service`)**
    - Implement `EnsureInitialized(workspaceID, month)`:
        - Logic to copy settings from previous month or default to all valid costs.
    - Implement `CalculateSafeToSpend`:
        - Formula: `Balance - Pending Included Fixed Costs - Pending One-Time Costs`.

- [x] **API Layer (`internal/spend/api`)**
    - `GET /api/spend/save-to-spend`: Returns full state.
    - `POST /api/spend/balance`: Update balance.
    - `POST /api/spend/fixed-costs/:id/paid`: Mark paid.
    - `POST /api/spend/fixed-costs/:id/pending`: Mark pending.
    - `POST /api/spend/fixed-costs/:id/include`: Include in calc.
    - `DELETE /api/spend/fixed-costs/:id/include`: Exclude from calc.
    - `POST /api/spend/one-time`: Create one-time cost.
    - `DELETE /api/spend/one-time/:id`: Delete one-time cost.

## Phase 2: Frontend Implementation

- [x] **Service Integration (`frontend/src/services/spend.js`)**
    - Create API client methods for all endpoints.

- [x] **UI Components (`frontend/src/components/spend/SaveToSpendPage.vue`)**
    - **Balance Card**: Display balance, edit dialog.
    - **Safe-to-Spend Card**: Display calculated amount with color coding.
    - **Fixed Costs List**:
        - Checkbox for paid/pending.
        - Button to exclude.
        - Accordion for excluded costs with include button.
    - **One-Time Costs List**:
        - Add cost dialog.
        - Checkbox for paid/pending.
        - Delete button.

- [x] **Routing**
    - Add `/save-to-spend` to `router/index.js`.
    - Add navigation link to sidebar.

## Phase 3: Integration & Testing

- [x] **Integration Testing**
    - Verify month roll-over logic (copying included status).
    - Verify calculation accuracy with mixed paid/pending/excluded items.
