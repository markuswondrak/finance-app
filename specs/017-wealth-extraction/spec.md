# Feature Specification: Wealth Extraction Option

**Feature Branch**: `017-wealth-extraction`
**Created**: 2025-12-21
**Status**: Draft
**Input**: User description: "As a user, I want to classify costs as wealth extractions to plan for large purchases or pension withdrawals from my accumulated assets."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fixed Cost Wealth Extraction (Priority: P1)

As a user planning for retirement, I want to classify regular monthly or quarterly withdrawals (e.g., pension payouts from my portfolio) as "Wealth Extraction" so that I can track these flows separately from standard expenses or income.

**Why this priority**: This is the core functionality for the "pension" use case mentioned in the requirements.

**Independent Test**: Can be fully tested by creating a new Fixed Cost and verifying that "Wealth Extraction" is available and selectable as a category.

**Acceptance Scenarios**:

1. **Given** I am on the Fixed Costs management screen, **When** I click to add or edit a cost, **Then** I see "Wealth Extraction" (Entnahme) as a selectable option alongside Expense, Income, and Saving.
2. **Given** I have selected "Wealth Extraction" for a fixed cost, **When** I save the form, **Then** the cost is successfully saved with this new category.
3. **Given** a list of fixed costs, **When** I view a "Wealth Extraction" cost, **Then** it is visually distinguishable (e.g., by label or icon) from other cost types.

---

### User Story 2 - Special Cost Wealth Extraction (Priority: P1)

As a user making a significant one-time purchase (e.g., a car or home down payment), I want to record this as a "Wealth Extraction" so that it is clear this money comes from my accumulated wealth assets rather than my monthly cash flow.

**Why this priority**: This addresses the "bigger purchases" use case and ensures consistency across both cost types.

**Independent Test**: Can be fully tested by creating a Special Cost and verifying the "Wealth Extraction" option is available.

**Acceptance Scenarios**:

1. **Given** I am adding a new Special Cost, **When** I open the type selector, **Then** "Wealth Extraction" is listed as an option.
2. **Given** I save a Special Cost as "Wealth Extraction", **When** I view the Special Costs list, **Then** the item is correctly categorized.

### Edge Cases

- What happens if I change a cost from "Expense" to "Wealth Extraction"? The system should update the category without losing data.
- How does this interact with the "Surplus" calculation? (Assumption: For this feature, we focus on the classification capability; calculation impacts are implicit or handled by the existing engine if it simply sums up types, but typically this should NOT reduce "Monthly Surplus" if the intent is to show it coming from Wealth, not Income. *Clarification might be needed on exact math, but usually Entnahme = Cash In from Wealth, acting like Income for Cash Flow, but reducing Wealth.*)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow users to select "Wealth Extraction" (Entnahme) as a category type when creating or editing a **Fixed Cost**.
- **FR-002**: The system MUST allow users to select "Wealth Extraction" (Entnahme) as a category type when creating or editing a **Special Cost**.
- **FR-003**: The UI MUST visually distinguish "Wealth Extraction" costs from Expense, Income, and Saving costs (e.g., via a distinct label, icon, or color).
- **FR-004**: The system MUST persist the "Wealth Extraction" classification in the database for both Fixed and Special costs.
- **FR-005**: Existing validation rules (e.g., positive amounts) MUST apply to "Wealth Extraction" costs.
- **FR-006**: The system MUST treat "Wealth Extraction" as a cash inflow (similar to Income) that increases the Monthly Surplus (Cash Flow) while simultaneously reducing the accumulated Wealth (Wealth Forecast) by the corresponding amount.

### Key Entities

- **FixedCost**: Updated to include `category` or `type` value for "Wealth Extraction".
- **SpecialCost**: Updated to include `category` or `type` value for "Wealth Extraction".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully save a Fixed Cost with the "Wealth Extraction" type 100% of the time.
- **SC-002**: Users can successfully save a Special Cost with the "Wealth Extraction" type 100% of the time.
- **SC-003**: The "Wealth Extraction" option appears in the UI dropdowns for all users.