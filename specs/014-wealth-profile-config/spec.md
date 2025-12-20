# Feature Specification: Wealth Profile Configuration

**Feature Branch**: `014-wealth-profile-config`
**Created**: 2025-12-20
**Status**: Draft

## Clarifications

### Session 2025-12-20
- Q: Is the implementation of the wealth forecast calculation and its visual chart display included in this task? → A: B, Table and chart will be implemented in subsequent features.
- Q: Where should the wealth profile parameters be stored in the backend database? → A: A, Dedicated `wealth_profiles` table (linked to User ID).
- Q: How should the editing experience be triggered? → A: B, Collapsible expansion panel (e.g., "Forecast Settings").
- Q: Should the system support multiple named wealth profiles per user? → A: B, Single: Exactly one wealth profile per user.
- Q: What are the specific valid ranges for the return rates and forecast duration? → A: A, Duration: 1-100 years; Rates: -20% to +100%.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure Wealth Parameters (Priority: P1)

As a user, I want to define my current financial status and future expectations (timeframe and market performance) so that the wealth forecast is based on my reality.

**Why this priority**: These parameters are the variables for the calculation engine. Without them, the forecast cannot run or will use generic defaults that might be irrelevant.

**Independent Test**: Can be tested by navigating to the new configuration section, entering values for all fields, saving, reloading the page, and verifying values are retained.

**Acceptance Scenarios**:

1. **Given** I am entering the Wealth overview page/section for the first time, **When** I enter "50000" for Current Wealth, "20" for Years, and "3", "7", "10" for the scenarios, **And** I click Save, **Then** the system confirms the save.
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
- **FR-003**: The system MUST validate inputs:
    - Current Wealth: Non-negative.
    - Forecast Duration: 1 to 100 years.
    - Return Rates (Worst, Average, Best): -20% to +100%.
    - Logical Consistency: Worst Case Rate <= Average Case Rate <= Best Case Rate.
- **FR-004**: The system MUST provide default values if the user has not configured them yet. The Backend API MUST return these defaults with a 200 OK status if no database record exists.
    - Defaults: Duration: 10 years, Worst Case: 3.0%, Average Case: 5.0%, Best Case: 7.0%.
- **FR-005**: The page can be accessed by a dedicated navigation entry "Vermögensübersicht". 
- **FR-006**: The parameters MUST be displayed within a collapsible expansion panel at the top of the "Vermögensübersicht" page, allowing users to view and edit them without navigating away.
- **FR-007**: (Out of Scope) Forecast calculation logic, charts, and tables are NOT part of this feature (to be handled in 015/016).

### Key Entities *(include if feature involves data)*

- **WealthProfile**: New database table `wealth_profiles`. 
    - `id` (Primary Key)
    - `user_id` (Foreign Key to users, UNIQUE)
    - `current_wealth` (Decimal/Numeric)
    - `forecast_duration_years` (Integer)
    - `rate_worst_case` (Decimal, e.g., 3.0)
    - `rate_average_case` (Decimal, e.g., 5.0)
    - `rate_best_case` (Decimal, e.g., 7.0)
    - `updated_at` (Timestamp)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can successfully update and save all 5 parameters.
- **SC-002**: Saved parameters are correctly retrieved on subsequent page loads.
- **SC-003**: Input validation prevents saving of obviously invalid data (e.g., negative duration).