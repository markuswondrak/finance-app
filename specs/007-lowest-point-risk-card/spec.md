# Feature Specification: Lowest Projected Point Card (Risk Metric)

**Feature Branch**: `007-lowest-point-risk-card`
**Created**: 2025-12-13
**Status**: Draft
**Input**: Create a highlight card that warns users of future liquidity crunches. The card scans the calculated forecast array for the next 12 months and finds the minimum value. Display this value prominently with conditional styling: green/neutral color if value is greater than zero, red/warning color with an alert icon if value is less than zero. This answers the question "Will I go broke when I buy that kitchen in August?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Lowest Projected Balance (Priority: P1)

As a user planning future expenses, I want to see the lowest point my balance will reach in the next 12 months so that I can anticipate potential liquidity problems before they happen.

**Why this priority**: Identifying the lowest projected point is the core value of this card. Users need this number to make informed decisions about major purchases.

**Independent Test**: Can be fully tested by viewing the card with forecast data that has various minimum points and verifying the correct minimum is displayed.

**Acceptance Scenarios**:

1. **Given** I have a forecast calculated for the next 12 months, **When** I view the Lowest Point card, **Then** I see the minimum balance value that will occur within that period
2. **Given** my forecast shows values [5000, 3000, 1500, 2000, 4000], **When** the minimum is calculated, **Then** the card displays 1500 as the lowest point
3. **Given** the lowest point value is displayed, **When** I view it, **Then** it is formatted as currency with appropriate separators

---

### User Story 2 - Receive Visual Warning for Negative Balance Risk (Priority: P2)

As a user who might face a negative balance, I want to see a clear visual warning when my lowest projected point is below zero so that I'm immediately alerted to the risk of going into debt.

**Why this priority**: The warning system transforms data into actionable insight. A negative lowest point is a critical risk that requires immediate user attention.

**Independent Test**: Can be fully tested by viewing the card with data that results in a negative minimum and verifying the alert styling appears.

**Acceptance Scenarios**:

1. **Given** my lowest projected point is below zero (e.g., -500), **When** I view the card, **Then** the value displays in red/warning color with an alert icon
2. **Given** my lowest projected point is above zero (e.g., +1500), **When** I view the card, **Then** the value displays in green/neutral color without an alert icon
3. **Given** my lowest projected point is exactly zero, **When** I view the card, **Then** it displays in neutral styling (borderline but not yet critical)

---

### User Story 3 - Understand When the Lowest Point Occurs (Priority: P3)

As a user viewing the lowest point warning, I want to know when this lowest point will occur so that I can correlate it with my planned expenses and take action.

**Why this priority**: Timing context helps users understand which expense causes the dip. This is supplementary to the core warning but enhances actionability.

**Independent Test**: Can be fully tested by viewing the card and verifying it indicates when (which month) the lowest point occurs.

**Acceptance Scenarios**:

1. **Given** the lowest point is displayed, **When** I view the card, **Then** I can see an indication of when this low point occurs (e.g., "in August" or "Month 8")
2. **Given** the lowest point occurs in March, **When** I view the card, **Then** the timing information helps me identify which planned expense causes the dip

---

### Edge Cases

- What happens when all projected values are positive? Display normally in green/neutral color
- What happens when all projected values are negative? Display the least negative (closest to zero) as minimum, in alert styling
- What happens when there's no forecast data? Display placeholder or prompt to configure forecast
- What happens when lowest point is exactly zero? Display in neutral styling (0 is safe but precarious)
- What happens when multiple months have the same minimum value? Display the first occurrence

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Card MUST scan the forecast data for the next 12 months and identify the minimum balance value
- **FR-002**: Card MUST display the lowest projected balance value in large, bold typography
- **FR-003**: Card MUST display in green/neutral color when the lowest point is greater than zero
- **FR-004**: Card MUST display in red/warning color when the lowest point is less than zero
- **FR-005**: Card MUST display an alert icon when the lowest point is less than zero
- **FR-006**: Card MUST NOT display an alert icon when the lowest point is greater than or equal to zero
- **FR-007**: Card MUST indicate when (which month) the lowest point occurs
- **FR-008**: Lowest point value MUST be formatted as currency with appropriate separators
- **FR-009**: Card MUST display a label identifying it as "Lowest Point" or similar risk metric
- **FR-010**: Card MUST update when forecast data changes (e.g., when current balance is modified)
- **FR-011**: When lowest point is exactly zero, card MUST display in neutral styling (not alert)

### Key Entities

- **Forecast Array**: The calculated projection of balance values for the next 12 months
- **Lowest Projected Point**: The minimum value found in the forecast array, representing the user's most financially vulnerable moment
- **Risk Status**: The categorization of the lowest point as safe (positive), precarious (zero), or at-risk (negative)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify whether they will face a negative balance within 2 seconds of viewing the card
- **SC-002**: Lowest point calculation is mathematically accurate 100% of the time (verifiable through test cases)
- **SC-003**: 95% of users correctly interpret the risk status (safe vs. at-risk) based on color coding in usability testing
- **SC-004**: Users report reduced financial anxiety due to advance warning of liquidity issues (target: 70% agreement in surveys)
- **SC-005**: Card correctly identifies and displays the minimum value across all test scenarios (positive only, mixed, negative only)

## Assumptions

- The forecast data for the next 12 months is already calculated and available
- The forecast includes the impact of all configured costs (monthly, quarterly, yearly, special)
- Forecast updates automatically when underlying data changes (current balance, costs, income)
- Currency is Euro (€) based on the existing application context
- The card follows the application's dark theme styling (Feature 001)
- Month indication can be relative ("in 3 months") or absolute ("August 2025")
