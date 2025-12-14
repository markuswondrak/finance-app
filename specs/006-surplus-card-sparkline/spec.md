# Feature Specification: Monthly Surplus Card with Sparkline

**Feature Branch**: `006-surplus-card-sparkline`
**Created**: 2025-12-13
**Status**: Draft
**Input**: Create a highlight card showing the Real Monthly Surplus (safe-to-spend money). Calculate as: Monthly Income minus (Monthly Fixed + Quarterly Fixed divided by 3 + Yearly Fixed divided by 12). Display the value prominently (e.g., "+ 450") and include a mini sparkline chart inside the card showing the surplus trend over the last 6 months. This helps users understand their true disposable income after accounting for hidden annual costs.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Real Monthly Surplus (Priority: P1)

As a user planning my monthly spending, I want to see my Real Monthly Surplus calculated and displayed prominently so that I know exactly how much "safe-to-spend" money I have after accounting for all recurring costs.

**Why this priority**: The calculated surplus value is the core purpose of this card. Users need to see this number to make informed spending decisions.

**Independent Test**: Can be fully tested by viewing the card and verifying the surplus value is calculated correctly based on income and costs.

**Acceptance Scenarios**:

1. **Given** I have monthly income and fixed costs configured, **When** I view the Monthly Surplus card, **Then** I see the Real Monthly Surplus displayed as a prominent value
2. **Given** my monthly income is 3000 and monthly fixed is 1500, quarterly fixed is 300, yearly fixed is 1200, **When** the surplus is calculated, **Then** it displays 1400 (3000 - 1500 - 100 - 100)
3. **Given** the calculated surplus is positive, **When** I view the value, **Then** it displays with a positive indicator (e.g., "+ 450 €")
4. **Given** the calculated surplus is negative, **When** I view the value, **Then** it displays with a negative indicator and alert styling

---

### User Story 2 - View Surplus Trend via Sparkline (Priority: P2)

As a user monitoring my financial health over time, I want to see a mini sparkline chart showing my surplus trend for the last 6 months so that I can understand whether my financial situation is improving or declining.

**Why this priority**: The sparkline provides historical context that enhances the single value. It's valuable but secondary to showing the current surplus.

**Independent Test**: Can be fully tested by viewing the card and verifying a sparkline displays historical surplus data for the past 6 months.

**Acceptance Scenarios**:

1. **Given** the Monthly Surplus card is displayed, **When** I view the card, **Then** I see a mini sparkline chart showing the surplus trend
2. **Given** surplus values exist for the past 6 months, **When** the sparkline renders, **Then** it displays 6 data points representing each month's calculated surplus
3. **Given** the sparkline is displayed, **When** I observe the trend, **Then** an upward trend indicates improving financial health and a downward trend indicates declining surplus

---

### User Story 3 - Understand True Disposable Income (Priority: P3)

As a user who wants to understand my finances, I want the card to help me recognize that the displayed surplus accounts for hidden annual costs so that I don't overspend thinking I have more money than I do.

**Why this priority**: Educational context enhances user understanding but is supplementary to the core calculation and display.

**Independent Test**: Can be fully tested by viewing the card and verifying contextual information is provided about what the surplus represents.

**Acceptance Scenarios**:

1. **Given** I view the Monthly Surplus card, **When** I look at the card label or description, **Then** I understand this represents "safe-to-spend" or disposable income
2. **Given** the surplus is calculated, **When** the card displays, **Then** it is clear this value accounts for all recurring costs (monthly, quarterly, yearly)

---

### Edge Cases

- What happens when there is no income configured? Display zero surplus or prompt user to configure income
- What happens when costs exceed income (negative surplus)? Display negative value in alert color with negative sign
- What happens when there is less than 6 months of historical data? Display available months; show partial sparkline
- What happens when no historical data exists? Show current value only; sparkline shows single point or is hidden
- What happens when quarterly or yearly costs are zero? Calculate correctly with those values as zero

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Card MUST calculate Real Monthly Surplus using the formula: Monthly Income - (Monthly Fixed + Quarterly Fixed / 3 + Yearly Fixed / 12)
- **FR-002**: Card MUST display the calculated surplus value in large, bold typography
- **FR-003**: Positive surplus values MUST display with positive indicator (e.g., "+ 450 €") in positive color
- **FR-004**: Negative surplus values MUST display with negative indicator (e.g., "- 150 €") in alert color
- **FR-005**: Card MUST include a sparkline chart showing surplus trend for the last 6 months
- **FR-006**: Sparkline MUST be compact and fit within the card without dominating the primary value
- **FR-007**: Surplus value MUST be formatted as currency with appropriate separators
- **FR-008**: Calculation MUST update when underlying income or cost values change
- **FR-009**: Card MUST display a label identifying it as "Monthly Surplus" or similar
- **FR-010**: Sparkline MUST handle partial data gracefully when less than 6 months of history exists

### Key Entities

- **Monthly Income**: The user's regular monthly inflow of money
- **Monthly Fixed Costs**: Recurring expenses paid every month
- **Quarterly Fixed Costs**: Recurring expenses paid every 3 months (prorated monthly as cost / 3)
- **Yearly Fixed Costs**: Recurring expenses paid annually (prorated monthly as cost / 12)
- **Real Monthly Surplus**: The calculated disposable income after accounting for all prorated recurring costs
- **Surplus History**: Historical surplus values used to generate the sparkline trend

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify their safe-to-spend amount within 2 seconds of viewing the card
- **SC-002**: Calculated surplus is mathematically accurate 100% of the time (verifiable through test cases)
- **SC-003**: Sparkline clearly indicates trend direction (improving/declining) to 90% of users in usability testing
- **SC-004**: Users report increased confidence in spending decisions after using the surplus metric (target: 80% agreement in surveys)
- **SC-005**: Card updates reflect changes to income or costs within 1 second

## Assumptions

- Monthly income, monthly fixed costs, quarterly fixed costs, and yearly fixed costs are already configured in the application
- Historical surplus data is calculated retroactively or stored when values change
- The sparkline library or component is available within the application framework
- Currency is Euro (€) based on the existing application context
- The card follows the application's dark theme styling (Feature 001)
- All cost values are provided as totals (e.g., total quarterly costs, not individual items)
