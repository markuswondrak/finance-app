# Feature Specification: Month Year Datepicker

**Feature Branch**: `009-month-year-datepicker`  
**Created**: 2025-12-18  
**Status**: Draft  
**Input**: User description: "the datamodel focuses month and year. All datepicker in the application should focus on only selcting the month and the year leaving out the day since it does not matter, because the forecast is done solely on year and month. There must be a single component implementing this requirement to be used in all forms dealing with year month data type"

## Clarifications

### Session 2025-12-18

- Q: How should the Month/Year data be strictly stored in the backend/database? → A: **First of Month** (e.g., `2025-01-01`): Store as a standard Date/Timestamp set to the 1st day.
- Q: What is the preferred UI interaction style for the picker? → A: **Popover/Menu**: Opens a calendar-like view on click. Best for dense forms. (Standard Vuetify `v-date-picker` behavior).
- Q: Should users be allowed to manually type dates into the input field? → A: **Selection Only**: Input field is read-only; clicks always open the picker. Prevents invalid manual entries.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Forecast Period (Priority: P1)

As a user entering financial data, I want to select a specific month and year without having to pick an irrelevant day, so that the data entry matches the monthly forecast model.

**Why this priority**: This is the core functionality requested. The current data model relies on Month/Year, and day selection is confusing/redundant.

**Independent Test**: Can be fully tested by opening a form with the new date picker and verifying that only Month and Year can be selected, and the resulting value is correct.

**Acceptance Scenarios**:

1. **Given** a form requiring a date input (e.g., forecast entry), **When** I open the date picker, **Then** I see options to select a Month and a Year, but NO option to select a specific Day.
2. **Given** I have selected "January 2026", **When** I confirm the selection, **Then** the field displays "January 2026" (or equivalent format) and the system stores the value corresponding to that month/year.

---

### User Story 2 - Consistent Date Selection (Priority: P2)

As a user navigating different parts of the application, I want the date selection experience to be identical across all forms, so that I don't have to learn different ways to input the same type of data.

**Why this priority**: Ensures the "single component" requirement is met from a user perspective (consistency) and system perspective (maintainability).

**Independent Test**: Navigate to at least two different forms that require Month/Year input and verify the picker looks and behaves exactly the same.

**Acceptance Scenarios**:

1. **Given** I am on the "Add Income" form, **When** I select a date, **Then** I use the Month/Year picker.
2. **Given** I am on the "Add Expense" form (or any other relevant form), **When** I select a date, **Then** I see the EXACT same Month/Year picker interface.

### Edge Cases

- **Manual Input Attempts**: The input field MUST be read-only to prevent manual entry errors; selection MUST happen via the picker.
- **Legacy Data**: What happens if the form was previously saved with a full date (including day)? The picker should display the Month/Year of that date and reset the day to the 1st upon save.
- **Year Range**: What is the range of years available? Should default to a reasonable range around the current year (e.g., +/- 10 years or all available years in data).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a UI component (Popover/Menu style) that restricts input to Month and Year only.
- **FR-002**: The date selection UI MUST NOT display a calendar grid of days.
- **FR-007**: The input field MUST be read-only, forcing the user to use the picker UI for all changes.
- **FR-003**: Users MUST be able to navigate between years to select a past or future year.
- **FR-004**: The selected value MUST be stored as a standard Date/Timestamp set to the 1st day of the selected month (e.g., `2025-01-01` for January 2025).
- **FR-005**: All existing date inputs in the application that relate to forecasting or monthly data MUST be replaced with this new Month/Year picker.
- **FR-006**: The picker MUST display the currently selected Month and Year clearly.

### Key Entities *(include if feature involves data)*

- **Forecast Date**: Represents a specific month in a specific year, ignoring the day component (conceptually YYYY-MM).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of date input fields related to forecast/monthly data allow ONLY Month and Year selection.
- **SC-002**: Users can select a date in fewer clicks than a standard full-date picker (if the standard picker required day selection).
- **SC-003**: No data entry errors related to "invalid day" occur for forecast entries.