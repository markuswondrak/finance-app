# Feature Specification: Current Balance Card with Click-to-Edit

**Feature Branch**: `005-balance-card-edit`
**Created**: 2025-12-13
**Status**: Draft
**Input**: Create a highlight card displaying the current balance (starting capital) in large bold text with an edit/pencil icon. Implement click-to-edit pattern where clicking anywhere on the card opens a modal dialog with an input field to update the current balance value. Upon saving, the entire forecast graph should recalculate with the new starting point.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Update Current Balance via Card Click (Priority: P1)

As a user whose bank account balance has changed, I want to click on the Current Balance card to update the value so that my forecast recalculates with the accurate starting point.

**Why this priority**: This is the primary interactive function of the card. Users need to update their balance to keep forecasts accurate, making this the core functionality.

**Independent Test**: Can be fully tested by clicking the card, entering a new value, saving, and verifying the forecast updates.

**Acceptance Scenarios**:

1. **Given** I am viewing the Current Balance card, **When** I click anywhere on the card, **Then** a modal dialog opens with an input field pre-filled with the current balance value
2. **Given** the edit modal is open, **When** I enter a new balance value and click save, **Then** the modal closes and the card displays the new value
3. **Given** I have saved a new balance value, **When** the modal closes, **Then** the forecast chart immediately recalculates and updates to reflect the new starting point

---

### User Story 2 - Display Current Balance Prominently (Priority: P2)

As a user viewing the dashboard, I want to see my current balance displayed in large, bold text so that I can quickly identify my starting capital at a glance.

**Why this priority**: The display of the balance is essential for the card's informational value, but secondary to the editing functionality which provides the interactive utility.

**Independent Test**: Can be fully tested by viewing the card and verifying the balance is displayed in large, bold, prominent typography.

**Acceptance Scenarios**:

1. **Given** I am viewing the dashboard, **When** I look at the Current Balance card, **Then** I see the balance value displayed in large, bold text
2. **Given** the Current Balance card is displayed, **When** I view it, **Then** I see a visible edit/pencil icon indicating the card is editable
3. **Given** I view the Current Balance card, **When** I compare it to other cards, **Then** the balance value is formatted as currency with appropriate separators

---

### User Story 3 - Cancel Balance Edit (Priority: P3)

As a user who opened the edit modal by mistake, I want to be able to cancel without saving changes so that my original balance remains unchanged.

**Why this priority**: Cancel functionality is a safety feature that prevents accidental changes. Important for user confidence but secondary to the core edit flow.

**Independent Test**: Can be fully tested by opening the modal, optionally changing the value, clicking cancel, and verifying the original balance remains.

**Acceptance Scenarios**:

1. **Given** the edit modal is open, **When** I click cancel or close the modal, **Then** the modal closes without saving any changes
2. **Given** I made changes in the edit modal, **When** I cancel the modal, **Then** the displayed balance remains unchanged from before I opened the modal
3. **Given** the edit modal is open, **When** I click outside the modal or press Escape, **Then** the modal closes without saving changes

---

### Edge Cases

- What happens when user enters a negative balance? Allow negative values as valid starting points (debt scenario)
- What happens when user enters non-numeric input? Display validation error and prevent saving until corrected
- What happens when user enters an extremely large number? Accept within reasonable limits; apply currency formatting
- What happens when user clears the input field? Require a value; prevent saving with empty input
- What happens if forecast recalculation fails? Display error message; keep previous value as fallback

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Card MUST display the current balance value in large, bold typography
- **FR-002**: Card MUST display a visible edit/pencil icon to indicate editability
- **FR-003**: Clicking anywhere on the card MUST open an edit modal dialog
- **FR-004**: Edit modal MUST contain an input field pre-populated with the current balance value
- **FR-005**: Edit modal MUST have a Save button to confirm changes
- **FR-006**: Edit modal MUST have a Cancel button or close option to discard changes
- **FR-007**: Upon saving, the new balance value MUST be persisted and displayed on the card
- **FR-008**: Upon saving, the forecast chart MUST recalculate using the new balance as the starting point
- **FR-009**: Balance input MUST validate for numeric values only
- **FR-010**: Balance MUST be displayed with proper currency formatting (thousands separators, currency symbol)
- **FR-011**: Edit modal MUST close when clicking outside the modal or pressing Escape key
- **FR-012**: Card MUST appear clickable through visual affordances (cursor change, hover state)
- **FR-013**: The Current Balance card and the edit modal MUST have rounded corners, consistent with other cards on the overview page.

### Key Entities

- **Current Balance**: The user's starting capital amount, serving as the anchor point for all forecast calculations; can be positive (assets) or negative (debt)
- **Edit Modal**: A dialog overlay containing the input field and action buttons for updating the balance
- **Forecast**: The calculated projection of future balances that depends on the current balance as its starting point

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can update their current balance within 10 seconds (open modal, enter value, save)
- **SC-002**: 95% of users successfully update their balance on the first attempt without errors
- **SC-003**: Forecast chart updates within 1 second after saving a new balance
- **SC-004**: Users correctly identify the card as editable through visual cues (verified via usability testing)
- **SC-005**: Zero data loss incidents when updating balance (value persists correctly after save)

## Assumptions

- Currency is Euro (€) based on the existing application context
- The current balance is stored locally and persists across sessions
- The forecast calculation logic already exists; this feature only provides a new input mechanism
- Only one user edits the balance at a time (no concurrent editing scenarios)
- The modal follows the application's dark theme styling (Feature 001)
