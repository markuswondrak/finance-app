# Research & Decisions: Fixed Cost Savings

**Feature**: `013-fixed-cost-savings`
**Date**: 2025-12-20

## Decisions

### 1. UI Component for "Purpose" Selection
- **Decision**: Use a 3-state `v-btn-toggle` for Income / Expense / Saving.
- **Rationale**:
    - Enforces mutual exclusivity visually and logically.
    - Reduces the number of clicks compared to separate checkboxes.
    - Aligns with the existing "Incoming" toggle but extends it naturally.
- **Alternatives Considered**:
    - **Separate Checkbox**: Rejected because it requires custom logic to disable/uncheck when "Incoming" is selected, which is more error-prone for the user.
    - **Dropdown**: Rejected because it hides options; a toggle is more prominent for a primary attribute.

### 2. Database Migration Strategy
- **Decision**: Add `is_saving` column with `default: false`.
- **Rationale**:
    - Safe for existing data (all current costs are standard expenses or income).
    - GORM handles this automatically with struct tags.
- **Alternatives Considered**:
    - **Nullable Boolean**: Rejected because "Saving" status should always be known (true/false).

### 3. Visual Indicator
- **Decision**: Use `mdi-piggy-bank` icon.
- **Rationale**: Universally recognized symbol for savings. Matches the app's financial context.

### 4. API Validation
- **Decision**: Backend returns `400 Bad Request` if `incoming=true` AND `is_saving=true`.
- **Rationale**: Protects data integrity against buggy clients or manual API calls. Frontend validation is strictly for UX.
