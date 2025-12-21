# Feature Specification: Wealth Overview Redesign

**Feature Branch**: `018-wealth-overview-redesign`
**Created**: 2025-12-21
**Status**: Draft
**Input**: User description: "the wealth overview page should be redesigned to match the style of the forcast overview page. To achieve that the configuration panel on the top should be replaced by 3 highlight cards that give insights to the welath development and allow to change the configuration parameters"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Wealth Insights (Priority: P1)

As a user, I want to see my key wealth parameters (Current Wealth, Time Horizon, Expected Return) presented as highlight cards at the top of the wealth overview page, so that I can quickly grasp my current configuration and status without a cluttered panel.

**Why this priority**: Core requirement of the redesign to match the Dashboard style.

**Independent Test**: Can be tested by navigating to the Wealth Overview page and verifying the presence of 3 KPI-style cards instead of the old configuration panel.

**Acceptance Scenarios**:

1. **Given** I am on the Wealth Overview page, **When** the page loads, **Then** I see three highlight cards at the top: "Current Wealth", "Time Horizon", and "Expected Return" (or similar).
2. **Given** the page loads, **When** I look at the cards, **Then** they display the currently configured values (e.g., "50.000 €", "20 Years", "Ø 5%").
3. **Given** the page loads, **When** I check the layout, **Then** the cards are arranged in a responsive grid (3 columns on desktop, stacked on mobile) matching the Forecast Overview style.

---

### User Story 2 - Edit Wealth Configuration (Priority: P1)

As a user, I want to be able to edit the configuration parameters directly from the highlight cards, so that I can easily adjust my wealth forecast simulation.

**Why this priority**: Essential functionality to interact with the forecast; static cards would break the feature.

**Independent Test**: Can be tested by clicking on each card and verifying that a corresponding edit dialog opens and saves changes.

**Acceptance Scenarios**:

1. **Given** I am viewing the "Current Wealth" card, **When** I click on it (or its edit icon), **Then** a modal opens allowing me to update my starting capital.
2. **Given** I have changed the capital in the modal, **When** I save, **Then** the modal closes, the card updates to the new value, and the forecast chart reloads.
3. **Given** I am viewing the "Time Horizon" card, **When** I edit it, **Then** I can change the duration (years) for the forecast.
4. **Given** I am viewing the "Expected Return" card, **When** I edit it, **Then** I can adjust the return rates (Worst, Average, Best case).

---

### Edge Cases

- What happens if the backend returns no profile? -> Cards should show default values or prompts to configure (e.g., "0 €", "Set Duration").
- What happens if I enter invalid values (e.g., negative duration)? -> Validation in the edit modals should prevent saving.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST replace the existing `WealthConfigPanel` with a section containing exactly 3 highlight cards.
- **FR-002**: The 3 cards MUST represent:
    1.  **Current Wealth**: Displays the user's current starting capital.
    2.  **Time Horizon**: Displays the forecast duration in years.
    3.  **Expected Return**: Displays the average expected yearly return rate (%).
- **FR-003**: Each card MUST be clickable or contain an edit action that opens a modal to modify its respective parameters.
- **FR-004**: The "Expected Return" edit modal MUST allow configuring all three rate scenarios: Worst Case, Average Case, and Best Case.
- **FR-005**: Upon saving changes in any card's modal, the system MUST persist the new configuration to the backend (`updateProfile`).
- **FR-006**: Upon saving changes, the system MUST trigger a refresh of the wealth forecast chart and table.
- **FR-007**: The visual style of the cards MUST be consistent with the Dashboard KPI cards (e.g., `CurrentBalanceCard`, `MonthlySurplusCard`), utilizing the same elevation, rounding, and typography.

### Key Entities *(include if feature involves data)*

- **WealthProfile**:
    - `current_wealth` (Currency)
    - `forecast_duration_years` (Integer)
    - `rate_worst_case` (Percentage)
    - `rate_average_case` (Percentage)
    - `rate_best_case` (Percentage)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can access and edit all 5 configuration parameters (wealth, duration, 3x rates) through the new card interface.
- **SC-002**: The wealth overview page layout aligns visually with the Forecast Overview (Dashboard), verified by visual inspection (consistent card usage).
- **SC-003**: 100% of valid configuration changes triggered via cards result in an updated forecast chart within 2 seconds (assuming standard network latency).