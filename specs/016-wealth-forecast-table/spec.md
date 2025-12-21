# Feature Specification: Wealth Forecast Table

**Feature Branch**: `016-wealth-forecast-table`
**Created**: 2025-12-20
**Status**: Draft

## Clarifications

### Session 2025-12-21

- Q: How should the table behave while the forecast data is being calculated or if no data is available? → A: Show Vuetify skeleton loader rows while loading; show a "No data available" message if empty.
- Q: Where should the Wealth Forecast Table be positioned relative to the existing Wealth Forecast Chart? → A: Below the Wealth Forecast Chart (vertical layout).
- Q: For the "Yearly" granularity, which value from the underlying monthly calculation should be shown in the table for each year? → A: End-of-year value (e.g., Value as of December 31st).
- Q: Should the table rows be styled to help differentiate between the different cases (Worst, Average, Best)? → A: Use subtle color-coding (e.g., in column headers or text color) matching the Chart series.
- Q: Should clicking a row in the table have any effect on the Wealth Forecast Chart (e.g., highlighting a data point)? → A: Yes, highlight the corresponding year/data point on the Chart when a row is hovered or clicked.
- Q: What styling should the table follow? → A: Match the styling of the Forecast Overview Table (using v-card with glass/border classes and v-table).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Detailed Forecast Data (Priority: P2)

As a user, I want to see a table with the exact yearly numbers for my wealth forecast, so that I can see the precise projected values at specific milestones (e.g., "How much will I have in 2035?").

**Why this priority**: Complements the chart (P1) by providing precision that a chart cannot.

**Independent Test**: Can be tested by viewing the Wealth page and verifying the table appears with correct columns and rows matching the duration.

**Acceptance Scenarios**:

1. **Given** a forecast duration of 10 years, **When** I view the table, **Then** I see 10 rows (plus maybe a start row).
2. **Given** the table is displayed, **When** I check the columns, **Then** I see "Year", "Total Invested", "Worst Case", "Average Case", "Best Case".
3. **Given** the Chart shows ~100k for Year 5, **When** I look at the Year 5 row in the table, **Then** the value matches (e.g., "100,250.00 €").

### Edge Cases

- **Long Duration**: If duration is 50 years, the table might be long. It should probably be scrollable or paginated (defaulting to simple scroll for now).
- **No Data**: If the forecast returns no data (e.g., error or invalid config), the table area displays a clear "No data available" feedback message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render a data table component positioned directly below the Wealth Forecast Chart. The table MUST match the styling of the Forecast Overview Table (encapsulated in a `v-card` with `glass border card-accent-primary` classes).
- **FR-002**: The table MUST display data with "Yearly" granularity, using the end-of-year (December) value for each projected year.
- **FR-003**: The table MUST include columns: Year, Total Invested, Worst Case Value, Average Case Value, Best Case Value. Columns for the three cases MUST use subtle color-coding matching the Wealth Forecast Chart series.
- **FR-004**: The table MUST format numerical values as currency (e.g., 2 decimals, currency symbol).
- **FR-005**: The table data MUST correspond exactly to the data visualized in the Wealth Chart.
- **FR-006**: The table MUST display Vuetify skeleton loader rows while data is loading and a "No data available" message if the result set is empty.
- **FR-007**: When a table row is hovered, the corresponding data points on the Wealth Forecast Chart SHOULD be highlighted or the chart's tooltip SHOULD be triggered for that year.

### Key Entities *(include if feature involves data)*

- **ForecastTableData**: Transient subset/aggregation of ForecastData.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Table renders with correct number of rows (Years).
- **SC-002**: Values in the table match the Chart values.
- **SC-003**: Currency formatting is correct and readable.