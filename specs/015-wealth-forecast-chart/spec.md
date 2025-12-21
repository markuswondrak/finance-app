# Feature Specification: Wealth Forecast Chart

**Feature Branch**: `015-wealth-forecast-chart`
**Created**: 2025-12-20
**Status**: Draft

## Clarifications

### Session 2025-12-20
- Q: Where should the chart component be placed? → A: On the existing `WealthOverviewPage`.
- Q: Where should the wealth forecast calculation logic reside? → A: Backend (Go).
- Q: What should be the granularity of the data points on the X-axis? → A: Yearly.
- Q: What type of chart visualization should be used? → A: Line Chart, copying the gradient styling from the Fixed Cost Overview forecast chart.
- Q: What should happen if no wealth profile exists (first visit)? → A: The configuration panel should open instantly with default values (Start Capital: 0, Duration: 20 years, Rates: 3%/5%/8%).
- Q: Should the forecast account for inflation (Real vs. Nominal values)? → A: No inflation adjustment (Nominal values).
- Q: Which lines should be visible by default and what colors should they use? → A: Show all 4 lines by default with no toggle options. Use White for "Total Invested", Green for "Best Case", and Red for "Worst Case" (Average Case will follow standard theme colors).
- Q: Should all lines use the gradient/area styling? → A: "Total Invested" as a simple line; Growth scenarios as area/gradient lines.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Wealth Forecast (Priority: P1)

As a user, I want to see a visual projection of my wealth over time, comparing what I invest vs. what I could earn in different market scenarios, so that I can understand the power of compound interest.

**Why this priority**: This is the core value proposition of the Wealth Management module.

**Independent Test**: Can be tested by ensuring Fixed Costs (Savings) and Wealth Profile data exist, then visiting the page and verifying the chart renders with 4 lines.

**Acceptance Scenarios**:

1. **Given** I have defined my savings and profile, **When** I view the `WealthOverviewPage`, **Then** I see a line chart with time on the X-axis and currency on the Y-axis.
2. **Given** the chart is displayed, **When** I inspect the lines, **Then** I see 4 distinct lines: "Total Invested" (White), "Worst Case" (Red), "Average Case", "Best Case" (Green).
3. **Given** a scenario where interest rates are > 0, **When** time progresses on the X-axis, **Then** the scenario lines should diverge upwards from the "Total Invested" line.
4. **Given** I change my "Monthly Savings" in Fixed Costs, **When** I reload the Wealth Chart, **Then** the curves update to reflect the new contribution levels.
5. **Given** I already set my welath configuration, **When** I visit the wealth management page **Then** the saved wealth configuration (interest rate, years, etc.) is shown on top of the page.
6. **Given** I visit the page for the first time (no profile configured), **When** the page loads, **Then** the configuration panel opens automatically populated with defaults (Start Capital: 0, Duration: 20y, Rates: 3%/5%/8%).


### Edge Cases

- **No Savings**: If Monthly Savings is 0, the chart should just show the growth of the Start Capital.
- **No Start Capital**: If Start Capital is 0, the chart starts at 0 and grows from savings.
- **Short Duration**: If duration is 1 year, chart might look short but should still work.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST aggregate all Fixed Costs where `is_saving=true` to determine the "Monthly Saving Amount".
- **FR-002**: The backend MUST retrieve `current_wealth`, `duration`, and `rates` from the Wealth Profile.
- **FR-003**: The backend MUST perform a monthly compound interest calculation for the specified duration for 3 scenarios (Worst, Average, Best).
    - Formula Logic per month: `NewBalance = OldBalance + MonthlySaving + (OldBalance * (YearlyRate / 12))` (simplified representation).
    - The `MonthlySaving` is calculated by the costs that carry the `is_saving` flag.
- **FR-004**: The backend MUST calculate a "Total Invested" baseline which is `StartCapital + (MonthlySaving * MonthCount)` (0% interest).
- **FR-005**: The system MUST render a **Line Chart** with 4 series corresponding to the calculated data on the `WealthOverviewPage`.
- **FR-006**: The chart X-Axis MUST represent Years. Data points MUST be provided on a yearly basis.
- **FR-007**: The chart visuals MUST align with the application's Dark Mode / Neon aesthetic. Specifically, it MUST copy the **gradient styling** used in the Fixed Cost Overview forecast chart.
- **FR-008**: On initial load, if no Wealth Profile exists, the UI MUST automatically open the configuration panel with these defaults: `current_wealth`=0, `duration`=20, `rate_worst`=3.0, `rate_avg`=5.0, `rate_best`=8.0.
- **FR-009**: The calculations MUST use nominal values and MUST NOT account for inflation.
- **FR-010**: All 4 lines MUST be visible by default. Legend-based toggling MUST be disabled or ignored.
- **FR-011**: Line colors MUST be assigned as follows: "Total Invested" = White, "Best Case" = Green, "Worst Case" = Red.
- **FR-012**: The "Total Invested" series MUST be rendered as a simple line, while the Worst, Average, and Best Case scenarios MUST use area/gradient filling beneath the lines.


### Key Entities *(include if feature involves data)*

- **ForecastData**: Transient data structure containing the calculated series points.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The chart renders successfully with valid input data.
- **SC-002**: Manual calculation check matches the system's output (within rounding error).
- **SC-003**: The chart responds to changes in underlying data (Fixed Costs or Profile) upon refresh.