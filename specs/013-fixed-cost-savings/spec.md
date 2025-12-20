# Feature Specification: Mark as Saving in Fixed Costs

**Feature Branch**: `013-fixed-cost-savings`
**Created**: 2025-12-20
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Flag Fixed Cost as Saving (Priority: P1)

As a user managing my budget, I want to be able to flag a specific fixed cost (like an ETF savings plan) as a "Saving" so that the system knows it is an investment for my long-term wealth, even though it counts as an expense in my monthly budget.

**Why this priority**: This is the foundational data entry step required for the entire Wealth Management module. Without this flag, the wealth calculation has no input data.

**Independent Test**: Can be fully tested by creating a new Fixed Cost, toggling "Mark as Saving", saving it, and verifying the flag persists when editing it again.

**Acceptance Scenarios**:

1. **Given** the "Create Fixed Cost" dialog is open, **When** I look for the options, **Then** I see a toggle or checkbox labeled "Mark as Saving".
2. **Given** I am editing an existing fixed cost, **When** I toggle "Mark as Saving" to ON and click Save, **Then** the change is saved.
3. **Given** a fixed cost marked as "Saving", **When** I view the Fixed Costs list, **Then** it visually indicates that it is a saving (e.g., with an icon or label).
4. **Given** a fixed cost marked as "Saving", **When** the monthly budget is calculated, **Then** the cost is still subtracted from the Monthly Surplus (it behaves like a normal expense).

### Edge Cases

- **Toggling off**: If a user unchecks "Mark as Saving", it should revert to a simple expense and stop contributing to the Wealth Forecast (once implemented).
- **Deletion**: If a Fixed Cost marked as "Saving" is deleted, it is removed from both the budget and future wealth calculations.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Fixed Cost data model MUST support a boolean flag `is_saving` (default: false).
- **FR-002**: The Fixed Cost Create/Edit UI MUST provide a user-interface element (toggle/checkbox) to set the `is_saving` flag.
- **FR-003**: The system MUST persist the `is_saving` flag to the database when a Fixed Cost is created or updated.
- **FR-004**: The system MUST continue to treat Fixed Costs with `is_saving=true` as expenses in the existing "Monthly Surplus" calculation (no change to budget logic).
- **FR-005**: The API response for Fixed Costs MUST include the `is_saving` field.

### Key Entities *(include if feature involves data)*

- **FixedCost**: Existing entity. Needs a new attribute `is_saving` (boolean).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can successfully save a Fixed Cost with the "Mark as Saving" flag enabled.
- **SC-002**: The "Monthly Surplus" calculation remains identical before and after marking a cost as a saving (ensuring it's still treated as an expense).
- **SC-003**: The API returns the correct `is_saving` status for all fixed costs.