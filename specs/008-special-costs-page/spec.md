# Feature Specification: Special Costs Page Functionality

**Feature Branch**: `008-special-costs-page`
**Created**: 2025-12-17
**Status**: Draft
**Input**: the special costs page should be made functional with respecting the currently already implemented function that might be not working. The page is accessed via the corresponding nav item in the navigation. Special costs are costs that are not occuring on a regular basis (like fixed costs) but once (like buying a car) It constist of a table with the columns Bezeichnung, Betrag (can be positive or negative) and "Fällig am", that lists all special costs that apply in the future. The button on the bottom opens up a modal panel. It takes all attributes relevant to save a special cost. The amount can be positive or negative. There must be user friendly way to choose between postive and negative. It should not be implied by a leading minus. After saving the special cost the cost is saved in the backend in the corresponding database table and added to the table of the specialcost page.

## Clarifications

### Session 2025-12-17

- Q: Should we stick to the existing Month/Year precision for "Due Date", or do we need to migrate the backend to support full dates? → A: Month/Year only (Match existing backend)
- Q: Should we refactor/fix existing `SpecialCosts.vue` files or build a new page from scratch? → A: Refactor/Fix Existing
- Q: Which UI control do you prefer for the Income/Expense selection in the modal? → A: Toggle Buttons (Income/Expense) with default to "Expense"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Future Special Costs (Priority: P1)

As a user, I want to see a list of my future one-time expenses and incomes (special costs) so that I can track irregular financial events.

**Why this priority**: Core functionality to visualize data. Without this, the user cannot see what exists.

**Independent Test**: Can be fully tested by navigating to the "Special Costs" page and verifying the table displays future entries correctly.

**Acceptance Scenarios**:

1. **Given** I am on the dashboard, **When** I click the "Special Costs" navigation item, **Then** I am navigated to the Special Costs page.
2. **Given** there are future special costs saved, **When** I view the page, **Then** I see a table listing them with columns: Description (Bezeichnung), Amount (Betrag), and Due Date (Fällig am).
3. **Given** there are past special costs, **When** I view the page, **Then** the table only displays entries with a Due Date in the future.
4. **Given** a special cost is an expense, **When** I view the table, **Then** the amount is displayed as a negative value (e.g., "- 500 €").
5. **Given** a special cost is an income, **When** I view the table, **Then** the amount is displayed as a positive value (e.g., "+ 500 €").

---

### User Story 2 - Add New Special Cost (Priority: P1)

As a user, I want to add a new special cost via a modal dialog so that I can plan for future irregular expenses or incomes.

**Why this priority**: Essential for data entry. The feature is useless if data cannot be created.

**Independent Test**: Can be fully tested by opening the modal, filling out the form, saving, and verifying the new entry appears in the list.

**Acceptance Scenarios**:

1. **Given** I am on the Special Costs page, **When** I click the "Add" button (bottom), **Then** a modal panel opens.
2. **Given** the modal is open, **When** I view the form, **Then** I see fields for Description, Amount, Due Date, and a Type selector (Income vs Expense) with "Expense" selected by default.
3. **Given** I select "Expense", **When** I enter "500" in the Amount field, **Then** the system interprets it as a negative value (-500) for calculation/storage.
4. **Given** I select "Income", **When** I enter "500" in the Amount field, **Then** the system interprets it as a positive value (+500).
5. **Given** I have filled all required fields validly, **When** I click "Save", **Then** the modal closes, the data is persisted to the backend, and the new entry appears in the table immediately.

---

### Edge Cases

- What happens when the user enters an invalid date or leaves a required field empty? The save button should be disabled or show an error message.
- What happens if the backend save fails? The user should be notified with an error message, and the modal should remain open with the entered data.
- What happens if the user enters "0" as amount? System should accept it (neutral event) or validate > 0. (Assumption: Amount must be non-zero to be useful).
- What happens if the due date is today? It counts as future (or present) and should be displayed.
- What happens if the user navigates away while the modal is open? Modal closes, changes lost.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a "Special Costs" page accessible via the main navigation.
- **FR-002**: The page MUST display a table of special costs with columns: "Bezeichnung" (Description), "Betrag" (Amount), and "Fällig am" (Due Date).
- **FR-003**: The table MUST only display special costs with a due date equal to or greater than the current date (Future costs).
- **FR-004**: The page MUST provide a button to open a "Add Special Cost" modal.
- **FR-005**: The modal MUST allow entering a Description, Amount, and Due Date.
- **FR-006**: The modal MUST provide a Toggle Button Group to select between "Income" (Positive) and "Expense" (Negative), defaulting to "Expense".
- **FR-007**: The system MUST validate that Description, Amount, and Due Date are provided before saving.
- **FR-008**: Upon saving, the system MUST persist the special cost to the backend database.
- **FR-009**: Upon successful save, the table MUST automatically update to include the new entry.
- **FR-010**: The system MUST handle and display existing special cost data correctly, respecting the current data structure if compatible.

### Key Entities

- **SpecialCost**: Represents a one-time financial event.
  - Attributes: ID, Description (String), Amount (Decimal/Int), DueDate (Date), Type (Derived from Amount sign).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully create a new special cost in under 30 seconds.
- **SC-002**: 100% of saved future special costs appear in the table immediately after creation.
- **SC-003**: Users make 0 errors regarding sign (positive/negative) entry due to the explicit Type selector.
- **SC-004**: The page loads and displays existing future costs in under 1 second.

## Assumptions

- "Fällig am" corresponds to `YearMonth` (Month/Year) in the backend, not a full date.
- The existing backend has a database table/structure for special costs (or one will be created/adapted matching the existing "implemented function").
- Currency is Euro (€), consistent with other app parts.
- "Future" includes the current month (Current Month/Year).