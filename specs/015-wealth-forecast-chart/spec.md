# Feature Specification: Wealth Forecast Chart

**Feature Branch**: `015-wealth-forecast-chart`
**Created**: 2025-12-20
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Wealth Forecast (Priority: P1)

As a user, I want to see a visual projection of my wealth over time, comparing what I invest vs. what I could earn in different market scenarios, so that I can understand the power of compound interest.

**Why this priority**: This is the core value proposition of the Wealth Management module.

**Independent Test**: Can be tested by ensuring Fixed Costs (Savings) and Wealth Profile data exist, then visiting the page and verifying the chart renders with 4 lines.

**Acceptance Scenarios**:

1. **Given** I have defined my savings and profile, **When** I view the Wealth page, **Then** I see a line chart with time on the X-axis and currency on the Y-axis.
2. **Given** the chart is displayed, **When** I inspect the lines, **Then** I see 4 distinct lines: "Total Invested", "Worst Case", "Average Case", "Best Case".
3. **Given** a scenario where interest rates are > 0, **When** time progresses on the X-axis, **Then** the scenario lines should diverge upwards from the "Total Invested" line.
4. **Given** I change my "Monthly Savings" in Fixed Costs, **When** I reload the Wealth Chart, **Then** the curves update to reflect the new contribution levels.

### Edge Cases

- **No Savings**: If Monthly Savings is 0, the chart should just show the growth of the Start Capital.
- **No Start Capital**: If Start Capital is 0, the chart starts at 0 and grows from savings.
- **Short Duration**: If duration is 1 year, chart might look short but should still work.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST aggregate all Fixed Costs where `is_saving=true` to determine the "Monthly Saving Amount".
- **FR-002**: The system MUST retrieve `current_wealth`, `duration`, and `rates` from the Wealth Profile.
- **FR-003**: The system MUST perform a monthly compound interest calculation for the specified duration for 3 scenarios (Worst, Average, Best).
    - Formula Logic per month: `NewBalance = OldBalance + MonthlySaving + (OldBalance * (YearlyRate / 12))` (simplified representation).
- **FR-004**: The system MUST calculate a "Total Invested" baseline which is `StartCapital + (MonthlySaving * MonthCount)` (0% interest).
- **FR-005**: The system MUST render a Line Chart with 4 series corresponding to the calculated data.
- **FR-006**: The chart X-Axis MUST represent Years.
- **FR-007**: The chart visuals MUST align with the application's Dark Mode / Neon aesthetic (e.g., specific colors for scenarios).

### Key Entities *(include if feature involves data)*

- **ForecastData**: Transient data structure containing the calculated series points.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The chart renders successfully with valid input data.
- **SC-002**: Manual calculation check matches the system's output (within rounding error).
- **SC-003**: The chart responds to changes in underlying data (Fixed Costs or Profile) upon refresh.