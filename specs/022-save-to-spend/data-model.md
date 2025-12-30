# Data Model: Save-To-Spend

**Feature**: `022-save-to-spend`
**Status**: Implemented

## New Entities

### 1. MonthlyPaymentStatus
Tracks the payment status and inclusion of a fixed cost for a specific month.

| Field | Type | Description |
|---|---|---|
| `WorkspaceID` | `uint` (FK) | References the workspace. |
| `FixedCostID` | `int` (FK) | References the recurring fixed cost. |
| `Month` | `YearMonth` | The year and month this status applies to (e.g., 2025-12). |
| `IsPaid` | `bool` | `true` if paid, `false` if pending. |

**Notes**:
- The presence of a record implies the fixed cost is "Included" in the Save-to-Spend calculation for this month.
- If a record is missing for a valid fixed cost, it is considered "Excluded".

### 2. OneTimePendingCost
Represents an ad-hoc expense relevant only for the current month's calculation (e.g., credit card bill).

| Field | Type | Description |
|---|---|---|
| `ID` | `uint` (PK) | Unique identifier. |
| `WorkspaceID` | `uint` (FK) | References the workspace. |
| `Name` | `string` | Description of the cost. |
| `Amount` | `int` | Amount in cents. |
| `Month` | `YearMonth` | The year and month this cost applies to. |
| `IsPaid` | `bool` | `true` if paid/cleared, `false` if pending. |

### 3. Workspace (Extension)
Existing entity extended with a field for the manual balance.

| Field | Type | Description |
|---|---|---|
| `SaveToSpendBalance` | `int` | The manually entered checking account balance in cents. |

## Relationships

- **Workspace** (1) -> (N) **MonthlyPaymentStatus**
- **FixedCost** (1) -> (N) **MonthlyPaymentStatus**
- **Workspace** (1) -> (N) **OneTimePendingCost**

## JSON Representations

### SaveToSpendResponse
```json
{
  "safeToSpend": 120000,
  "checkingBalance": 200000,
  "currentMonth": {
    "year": 2025,
    "month": 12
  },
  "includedFixedCosts": [
    { "id": 1, "name": "Rent", "amount": 80000, "isPaid": false }
  ],
  "excludedFixedCosts": [
    { "id": 2, "name": "Groceries", "amount": 40000 }
  ],
  "oneTimeCosts": [
    { "id": 101, "name": "Credit Card", "amount": 35000, "isPaid": false }
  ],
  "pendingTotal": 115000
}
```
