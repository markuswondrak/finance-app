# Feature Specification: Wealth Profile Configuration

**Feature Branch**: `014-wealth-profile-config`
**Created**: 2025-12-20
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure Wealth Parameters (Priority: P1)

As a user, I want to define my current financial status and future expectations (timeframe and market performance) so that the wealth forecast is based on my reality.

**Why this priority**: These parameters are the variables for the calculation engine. Without them, the forecast cannot run or will use generic defaults that might be irrelevant.

**Independent Test**: Can be tested by navigating to the new configuration section, entering values for all fields, saving, reloading the page, and verifying values are retained.

**Acceptance Scenarios**:

1. **Given** I am on the Wealth Configuration page/section, **When** I enter "50000" for Current Wealth, "20" for Years, and "3", "7", "10" for the scenarios, **And** I click Save, **Then** the system confirms the save.
2. **Given** I have saved my configuration, **When** I log out and log back in, **Then** the configuration fields show my saved values.
3. **Given** I enter invalid data (e.g., negative years), **When** I try to save, **Then** the system prevents saving and shows an error.

### Edge Cases

- **Zero Values**: If interest rates are 0%, the forecast should still work (flat line for interest).
- **Extreme Values**: If a user enters 100 years or 1000% interest, the system should handle it (though UI might look weird, the math should hold or be capped if necessary - assuming reasonable limits for now).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a user interface to input the following parameters:
    - Current Wealth (Currency Amount)
    - Forecast Duration (Years)
    - Worst Case Return Rate (%)
    - Average Case Return Rate (%)
    - Best Case Return Rate (%)
- **FR-002**: The system MUST persist these parameters associated with the user's profile.
- **FR-003**: The system MUST validate inputs (e.g., non-negative wealth, positive duration, percentage rates between 0-100 is reasonable but maybe higher allowed).
- **FR-004**: The system MUST provide default values if the user has not configured them yet (e.g., Duration: 10 years, Rates: 3%, 5%, 7%).

### Key Entities *(include if feature involves data)*

- **WealthProfile** (or UserSettings): New entity or extension of existing user profile. Attributes: `current_wealth`, `forecast_duration_years`, `rate_worst_case`, `rate_average_case`, `rate_best_case`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can successfully update and save all 5 parameters.
- **SC-002**: Saved parameters are correctly retrieved on subsequent page loads.
- **SC-003**: Input validation prevents saving of obviously invalid data (e.g., negative duration).