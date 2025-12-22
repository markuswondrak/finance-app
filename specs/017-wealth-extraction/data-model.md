# Data Model: Wealth Extraction

**Feature**: 017-wealth-extraction
**Version**: 1.0.0

## Entity Updates

### FixedCost / SpecialCost

No physical schema changes. The `IsSaving` and `Amount` fields are reused to define the new "Wealth Extraction" category.

| Logical Category | `IsSaving` | `Amount` Sign | Description |
| :--- | :--- | :--- | :--- |
| **Expense** | `false` | Negative | Standard spending. |
| **Income** | `false` | Positive | Salary, dividends, etc. |
| **Saving** | `true` | Negative | Money moving from Cash -> Wealth. |
| **Wealth Extraction** | `true` | Positive | Money moving from Wealth -> Cash. |

## Validation Rules

- **Wealth Extraction**:
  - Must have `IsSaving = true`.
  - Must have `Amount > 0`.
  - Must be allowed in both `FixedCost` (monthly/recurring) and `SpecialCost` (one-time).

## Data Flow

1.  **Frontend Form**:
    - User selects "Wealth Extraction".
    - `type` set to `'wealth_extraction'`.
    - `Utils.js` converts to `IsSaving = true`, `Amount = +Value`.

2.  **Backend Processing**:
    - `CalculateSurplus`: Sees positive amount -> Treats as Income (Cash Inflow).
    - `CalculateWealth`: Sees `IsSaving = true` -> Subtracts amount from Wealth.
        - `Wealth = Wealth - (+Value)`.
