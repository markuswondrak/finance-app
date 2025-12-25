# Data Model & Component Structure

## Components

### `LandingPage.vue` (Parent)
- **Responsibility**: Orchestrates the landing page layout.
- **State**: None (mostly static composition).
- **Children**:
  - `LandingHero`
  - `WealthFeature`
  - `SavingsCalculator`
  - `LandingFooter`

### `LandingHero.vue`
- **Responsibility**: "Made in EU" badge, headline, subheadline, "Login with Google" button.
- **Props**: None.
- **Events**: `login` (dispatches auth action).

### `WealthFeature.vue`
- **Responsibility**: Marketing content for wealth management.
- **Content**: Static text and illustration/icon.

### `SavingsCalculator.vue`
- **Responsibility**: Interactive savings projection.
- **State**:
  - `monthlySavings` (Number, default: 200)
  - `returnRate` (Number, default: 5.0)
  - `years` (Number, default: 15)
- **Computed**:
  - `chartData`: Object structure for Chart.js
  - `finalAmount`: Number (Currency formatted)
- **Methods**:
  - `calculateProjection()`: Updates `chartData` and `finalAmount`.

### `LandingFooter.vue`
- **Responsibility**: Legal links.
- **Links**: "Impressum", "Datenschutz".

## Entities

### Calculator Projection
*Client-side transient entity*

| Field | Type | Description |
|-------|------|-------------|
| `monthlyContribution` | Number | User input for monthly savings |
| `interestRate` | Number | User input for annual return % |
| `durationYears` | Number | User selection (15, 20, 25) |
| `totalInvested` | Number | Calculated: `monthly * 12 * years` |
| `totalInterest` | Number | Calculated: `finalValue - totalInvested` |
| `finalValue` | Number | Compound interest result |
