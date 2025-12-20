# Feature Specification: Wealth Forecast Table

**Feature Branch**: `016-wealth-forecast-table`
**Created**: 2025-12-20
**Status**: Draft

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

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render a data table component.
- **FR-002**: The table MUST display data with "Yearly" granularity (aggregating or taking the end-of-year value from the monthly calculation).
- **FR-003**: The table MUST include columns: Year, Total Invested, Worst Case Value, Average Case Value, Best Case Value.
- **FR-004**: The table MUST format numerical values as currency (e.g., 2 decimals, currency symbol).
- **FR-005**: The table data MUST correspond exactly to the data visualized in the Wealth Chart.

### Key Entities *(include if feature involves data)*

- **ForecastTableData**: Transient subset/aggregation of ForecastData.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Table renders with correct number of rows (Years).
- **SC-002**: Values in the table match the Chart values.
- **SC-003**: Currency formatting is correct and readable.