# Tasks: Save-To-Spend

**Feature**: `022-save-to-spend`
**Status**: Implemented

## Backend Tasks

- [x] **Data Access**
    - Define `MonthlyPaymentStatus` struct and GORM migration.
    - Define `OneTimePendingCost` struct and GORM migration.
    - Add `SaveToSpendBalance` to `Workspace` model.
    - Create `internal/spend/repository` package.

- [x] **Business Logic (`SpendService`)**
    - Implement `EnsureInitialized`: Logic to seed current month data.
    - Implement `CalculateSafeToSpend` algorithm.
    - Implement helper to check fixed cost validity (dates/cycle).

- [x] **API Handlers**
    - Scaffold `SpendHandler`.
    - Implement `GetSaveToSpend` aggregator.
    - Implement state mutation handlers (Pay, Include, Update Balance).

## Frontend Tasks

- [x] **Setup**
    - Create `SpendService` in frontend services.
    - Register route `/save-to-spend`.

- [x] **Component: SaveToSpendPage**
    - Implement Layout (Container, Grid).
    - Implement Balance Section (View/Edit).
    - Implement Safe-To-Spend Display (Reactive calculation).
    - Implement Fixed Cost List (Paid toggle, Include/Exclude).
    - Implement One-Time Cost List (Add, Pay, Delete).
    - Add Empty States and Loading indicators.

## Verification

- [x] **Manual Testing**
    - Verify "Safe to Spend" updates immediately on any change.
    - Verify persistence of "Included" costs across sessions.
    - Verify One-Time costs do not appear in global Fixed Costs.
