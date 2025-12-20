# Feature Specification: Mark as Saving in Fixed and Special Costs

**Feature Branch**: `013-fixed-cost-savings`
**Created**: 2025-12-20
**Status**: Draft

## Clarifications

### Session 2025-12-20
- Q: How should a "Saving" cost be visually distinguished in the list view? → A: Icon (e.g., Piggy Bank) displayed next to the cost name.
- Q: Can a cost marked as "Incoming" (i.e., Income/Salary) also be marked as a "Saving"? → A: No (Mutually Exclusive). "Mark as Saving" is disabled/hidden if "Incoming" is true.
- Q: Which UI component should be used for the "Mark as Saving" flag in the Edit Form? → A: v-checkbox (Note: Superseded by the 3-state selector below).
- Q: Does this apply to both Fixed and Special Costs? → A: Yes, the savings option MUST be available in both the Fixed Costs and Special Costs forms.
- Q: How should the "Purpose" of a cost be selected in the UI? → A: Instead of separate controls for Income/Expense and Saving, use a single 3-state selector (e.g., `v-btn-toggle`) with options: **Income (Einnahme)**, **Expense (Ausgabe)**, and **Saving (Sparen)**.
- Q: How should the backend handle a request where both `incoming=true` and `is_saving=true` are set (an invalid state)? → A: Reject with 400 Bad Request.
- Q: How should existing records be handled during database migration for the new `is_saving` column? → A: Set default to `false` for all existing records.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Flag Cost as Saving (Priority: P1)

As a user managing my budget, I want to be able to categorize a cost as a "Saving" so that the system knows it is an investment for my long-term wealth, even though it counts as an expense in my monthly budget.

**Why this priority**: This is the foundational data entry step required for the entire Wealth Management module. Without this flag, the wealth calculation has no input data.

**Independent Test**: Can be fully tested by creating a new Fixed/Special Cost, selecting "Sparen" (Saving) as the purpose, saving it, and verifying the state persists when editing it again.

**Acceptance Scenarios**:

1. **Given** the "Create Fixed Cost" or "Special Cost" dialog is open, **When** I look for the purpose options, **Then** I see a 3-state selector with "Einnahme" (Income), "Ausgabe" (Expense), and "Sparen" (Saving).
2. **Given** I am editing an existing cost, **When** I change the purpose to "Sparen" and click Save, **Then** the change is saved.
3. **Given** a cost marked as "Saving", **When** I view the respective list, **Then** it visually indicates that it is a saving (displaying a "Piggy Bank" icon next to the name).
4. **Given** a cost marked as "Saving", **When** the monthly budget is calculated, **Then** the cost is still subtracted from the Monthly Surplus (it behaves like a normal expense).
5. **Given** a malicious or buggy API request with both `incoming=true` and `is_saving=true`, **When** the backend receives the request, **Then** it returns a 400 Bad Request error.

### Edge Cases

- **Changing Purpose**: Changing a "Saving" to "Expense" removes it from future wealth calculations but keeps it in the budget. Changing it to "Income" makes it an addition to the budget instead of a subtraction.
- **Deletion**: If a cost marked as "Saving" is deleted, it is removed from both the budget and future wealth calculations.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Fixed Cost and Special Cost data models MUST support a boolean flag `is_saving` (default: false).
- **FR-002**: The Create/Edit UI for both Fixed Costs and Special Costs MUST provide a single 3-state selector (e.g., `v-btn-toggle`) to choose the purpose:
    - **Income (Einnahme)**: Maps to `incoming=true, is_saving=false`.
    - **Expense (Ausgabe)**: Maps to `incoming=false, is_saving=false`.
    - **Saving (Sparen)**: Maps to `incoming=false, is_saving=true`.
- **FR-003**: The system MUST persist the `is_saving` and `incoming` flags to the database when a cost is created or updated based on the 3-state selection.
- **FR-004**: The system MUST continue to treat costs with `is_saving=true` (and `incoming=false`) as expenses in the existing "Monthly Surplus" calculation (no change to budget logic).
- **FR-005**: The API responses for both Fixed Costs and Special Costs MUST include the `is_saving` field.
- **FR-006**: In the list views (Fixed Costs Table, Special Costs Table), items with `is_saving=true` MUST be distinguished by a "Piggy Bank" icon placed next to the cost name.
- **FR-007**: The Backend API MUST validate that `incoming` and `is_saving` are never both set to `true` and reject such requests with a 400 status code.

### Key Entities *(include if feature involves data)*

- **FixedCost**: Existing entity. Needs a new attribute `is_saving` (boolean, not null, default: false).
- **SpecialCost**: Existing entity. Needs a new attribute `is_saving` (boolean, not null, default: false).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can successfully save a cost with the "Sparen" (Saving) purpose selected.
- **SC-002**: The "Monthly Surplus" calculation remains identical before and after marking a cost as a saving (as it remains a subtraction).
- **SC-003**: The API returns the correct `is_saving` status for all fixed and special costs.
- **SC-004**: The UI enforces mutual exclusivity between Income, Expense, and Saving purposes via the 3-state selector.
- **SC-005**: The API rejects invalid states (Income + Saving) with a 400 error.
