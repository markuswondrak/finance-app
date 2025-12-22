# Research & Discovery: Wealth Extraction

**Feature**: 017-wealth-extraction
**Date**: 2025-12-21

## 1. Unknowns Analysis

### Category Implementation
- **Finding**: Categories are not explicit enums. The system uses a combination of `Amount` sign and `IsSaving` boolean.
  - **Income**: `Amount > 0`, `IsSaving = false`
  - **Expense**: `Amount < 0`, `IsSaving = false`
  - **Saving**: `Amount < 0`, `IsSaving = true`
- **Decision**: "Wealth Extraction" will be modeled as:
  - `Amount > 0` (Positive inflow)
  - `IsSaving = true` (affects wealth)
- **Impact**: No database schema change required.

### Wealth Calculation Logic
- **Finding**: `backend/internal/services/wealth_forecast_service.go` currently uses `math.Abs(amount)` for all `IsSaving` costs, assuming they are always savings (wealth additions).
- **Change Required**: Remove `math.Abs` and subtract the raw amount.
  - `Wealth = Wealth - Cost.Amount`
  - Saving (-500) -> `Wealth - (-500)` -> `Wealth + 500` (Increase)
  - Extraction (+500) -> `Wealth - (+500)` -> `Wealth - 500` (Decrease)

### Surplus Calculation
- **Finding**: `backend/internal/api/statistics.go` calculates surplus purely based on `Amount > 0` (Income) or `Amount < 0` (Expense).
- **Result**: Wealth Extraction (Positive Amount) will automatically be treated as Income/Inflow. No change needed here for the calculation itself.

### Frontend Integration
- **Finding**: `IncomingSelect.vue` defines the category toggle. `Utils.js` (`baseFormToCost`) handles the mapping.
- **Change**: Update `IncomingSelect.vue` to add "Wealth Extraction" option. Update `Utils.js` to handle the `type: 'wealth_extraction'` mapping.

## 2. Technical Decisions

| Decision | Rationale | Alternatives |
| :--- | :--- | :--- |
| **Model as IsSaving=true, Amount>0** | Fits existing schema without migration. Logically consistent: it *is* a wealth-related flow. | Add explicit `Category` enum (requires DB migration). |
| **Update Wealth Service Formula** | Simplest way to support bidirectional flow between Cash and Wealth. | Create separate "Extraction" service (overkill). |
| **Frontend "Blue" for Extraction** | Reuses existing styling infrastructure while giving distinct meaning. | Use new color (Green?), but Blue was requested. |

## 3. Implementation Checklist

- [ ] Backend: Modify `WealthForecastService.CalculateForecast` to support negative `IsSaving` values (extractions).
- [ ] Backend: Unit test to verify Extraction decreases Wealth.
- [ ] Frontend: Update `IncomingSelect.vue` with new option.
- [ ] Frontend: Update `Utils.js` logic for `wealth_extraction` type.
- [ ] Frontend: Update `FixedCostTable.vue` and `SpecialCostsPage.vue` to display correct icon/color.
- [ ] Frontend: Refactor "Saving" color to Amber.
