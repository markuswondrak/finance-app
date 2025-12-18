# Research: Special Costs Page Functionality

**Feature Branch**: `008-special-costs-page`
**Status**: Completed

## 1. Backend Analysis
**Finding**: The backend already has full support for special costs.
- **Model**: `backend/internal/models/specialcost.go` exists with `ID`, `Name`, `Amount`, `DueDate` (`YearMonth` type).
- **API**: `backend/internal/api/specialcosts.go` implements:
  - `GET /api/specialcosts`
  - `POST /api/specialcosts` (Create/Update)
  - `DELETE /api/specialcosts/:id`
- **Constraint**: The `DueDate` is strictly `YearMonth` ({ Year: int, Month: int }). The frontend MUST respect this and not try to send a full date string.

## 2. Frontend State
**Finding**: Frontend components exist but may be incomplete or using legacy patterns.
- `frontend/src/components/SpecialCosts.vue`: Main table view. Needs update to filter future costs and format amounts/dates correctly.
- `frontend/src/components/editform/SpecialCostForm.vue`: Modal form. Needs the new "Income/Expense" toggle logic.
- **Service**: Need to check if `frontend/src/services/specialcosts.js` (or similar) exists. If not, must create it to abstract API calls.

## 3. UI/UX Decisions
**Income/Expense Toggle**:
- **Design**: Use `v-btn-toggle` (Vuetify) or two exclusive `v-btn`s.
- **Logic**:
  - Selection "Expense" -> Visual Red, stored as negative `amount`.
  - Selection "Income" -> Visual Green, stored as positive `amount`.
  - The user enters a positive number in the input field regardless of type. The code negates it before sending if "Expense" is selected.

**Date Selection**:
- Since backend uses `YearMonth`, the date picker in the modal should ideally be a month picker (`type="month"` or generic date picker that ignores day).
- Display in table: Format `YearMonth` to "Month Year" (e.g., "Oktober 2025").

## 4. Testing Strategy
- **Backend**: Existing tests likely cover the API. We can assume backend is stable unless we find bugs.
- **Frontend**: Create unit tests for `SpecialCosts.vue` (filtering logic, rendering) and `SpecialCostForm.vue` (validation, sign conversion).
