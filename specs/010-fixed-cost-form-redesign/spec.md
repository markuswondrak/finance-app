# Feature Specification: Fixed Cost Form Redesign

**Feature Branch**: `010-fixed-cost-form-redesign`
**Created**: 2025-12-18
**Status**: Draft
**Input**: User description: "Adjust the forms in the fixedcost view (monthly, quaterly, halfyearly and yearly) to match the design of the secialcost form (income, expanse toggle, rounded cornors). After submitting the form the new entry should be adde dto the corresponding table. a small notification should indicate that the new cost was sucessfully added"

## Clarifications
### Session 2025-12-18
- Q: Should the form close or reset after a successful save? → A: Close immediately (Option A)
- Q: What UI component should be used for the success notification? → A: Existing Snackbar (Option A)
- Q: Should the date picker also be updated to match the Special Costs form style? → A: No, use existing picker

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unified Form Design (Priority: P1)

As a user, I want the Monthly, Quarterly, Half-Yearly, and Yearly fixed cost forms to look consistent with the Special Costs form so that the application feels cohesive and modern.

**Why this priority**: Visual consistency significantly improves user experience and reduces cognitive load.

**Independent Test**: Verify that opening any fixed cost form displays a UI matching the Special Costs form (rounded corners, specific toggle style) without needing to submit data.

**Acceptance Scenarios**:

1. **Given** I am on the Fixed Costs view, **When** I open the "Add Monthly Cost" form, **Then** the form should have rounded corners and the standard "Income/Expense" toggle styled like the Special Costs form.
2. **Given** I am on the Fixed Costs view, **When** I open the "Add Yearly Cost" form, **Then** it should visually match the Monthly and Special Costs forms.

---

### User Story 2 - Seamless Data Entry & Feedback (Priority: P1)

As a user, I want the list of costs to update immediately and see a success message when I save a cost, so that I know my changes were saved without losing my context.

**Why this priority**: Immediate feedback and no-reload updates make the application feel faster and more responsive.

**Independent Test**: Add a new cost and verify the table update and notification occur.

**Acceptance Scenarios**:

1. **Given** I have filled out a Fixed Cost form, **When** I click "Save", **Then** the form should close (or reset), the new entry should appear in the corresponding table immediately, and a success notification should appear.
2. **Given** I edit an existing cost, **When** I save the changes, **Then** the table row should reflect the updated values immediately, and a success notification should appear.

---

### Edge Cases

- What happens when the server request fails? (Should show error notification and keep form open/data preserved).
- What happens if the network is slow? (Should show loading state on the save button).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Monthly, Quarterly, Half-Yearly, and Yearly fixed cost forms MUST adopt the visual styling of the Special Costs form (specifically rounded corners and card layout).
- **FR-002**: All fixed cost forms MUST use the standardized "Income/Expense" toggle switch component/style used in Special Costs.
- **FR-003**: Upon successful form submission (Add or Edit), the application MUST update the relevant data table to include the new/updated record without triggering a full page reload.
- **FR-004**: The system MUST display a transient success notification using the existing Snackbar component stating "Cost successfully added" (or similar) upon successful save.
- **FR-005**: The forms MUST retain their existing field validation logic (required fields, amount formatting).
- **FR-006**: The form/modal MUST close immediately upon successful save.
- **FR-007**: The date picker component style MUST remain unchanged.

### Key Entities

- **FixedCost**: Represents a recurring cost (Monthly, Quarterly, Half-Yearly, Yearly). Attributes: Name, Amount, Type (Income/Expense), Date/Interval.
- **CostTable**: The UI component displaying the list of costs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: **100%** of fixed cost forms match the border-radius and control styling of the Special Costs form.
- **SC-002**: Data tables reflect added/edited entries in **under 1 second** (perceived instant) after save confirmation, without page reload.
- **SC-003**: A success notification is visible for at least **3 seconds** after every successful create/update operation.
