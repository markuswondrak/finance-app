# Research: Lowest Projected Point Card

**Feature Branch**: `007-lowest-point-risk-card`
**Status**: Completed

## 1. Logic Implementation
**Decision**: Encapsulate calculation logic within `LowestPointCard.vue`.
**Rationale**: Keeps the parent `Overview.vue` clean and groups display logic with the component.
**Approach**:
- Prop: `entries` (Array of objects with `currentAmount` and `yearMonth` struct).
- Computed `lowestEntry`: Iterate over `entries` to find the object with minimum `currentAmount`.
- Computed `lowestAmount`: `lowestEntry.currentAmount`.
- Computed `lowestDate`: `lowestEntry.yearMonth` converted to JS Date.

## 2. Date Formatting
**Decision**: Use `Intl.DateTimeFormat` for "Month Year" display.
**Rationale**: Native API, supports localization (German/English), no external library needed.
**Pattern**: `new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(date)` -> "August 2025".

## 3. Visual Styling
**Decision**: Use standard Vuetify colors and custom classes matching `finance.css`.
**Colors**:
- Positive (> 0): `text-success` (mapped to mint green in theme)
- Negative (< 0): `text-error` (mapped to soft red/coral in theme)
- Zero (= 0): `text-white` or `text-grey-lighten-1` (neutral)
**Icon**:
- Negative: `mdi-alert-circle-outline` (or similar warning icon)
- Positive/Zero: No icon (or checkmark if desired, but spec implies alert only for risk).

## 4. Integration
**Decision**: Import in `Overview.vue` and pass `entries` prop.
**Placement**: In the KPI row, replacing the third placeholder card (currently `MonthlySurplusCard` in the previous spec, but this feature is #007, presumably adding/replacing one or fitting in layout).
**Note**: `Overview.vue` currently shows 3 columns. `CurrentBalanceCard`, `KPICard` (Monthly Change), `MonthlySurplusCard`.
The spec for 007 says "Lowest Point Card". Wait, where does it fit?
The `Overview.vue` has:
```html
<v-col cols="12" sm="4">
  <CurrentBalanceCard ... />
</v-col>
<v-col cols="12" sm="4">
  <KPICard ... />
</v-col>
<v-col cols="12" sm="4">
  <MonthlySurplusCard ... />
</v-col>
```
If I add a 4th card, the layout breaks (12 cols).
The spec doesn't say "replace". It says "Create a highlight card".
The `constitution.md` under Layout Architecture says:
"- KPI Cards: Three highlight cards in a row beneath the chart"
  - Current Balance
  - Real Monthly Surplus
  - **Lowest Projected Point (risk indicator)**

Ah! The constitution lists "Lowest Projected Point" as the 3rd card.
But `Overview.vue` (from file read) has:
1. `CurrentBalanceCard`
2. `KPICard` (Monthly Change / Average - generic)
3. `MonthlySurplusCard`

It seems the "Monthly Change" generic KPI card is the one to be replaced or the "Lowest Point" is the 3rd one and `MonthlySurplus` is the 2nd?
Let's check `Overview.vue` again.
Line 83: `CurrentBalanceCard`
Line 90: `KPICard` (Title: "Monatliche Änderung" or "Average")
Line 101: `MonthlySurplusCard`

The constitution says:
1. Current Balance
2. Real Monthly Surplus
3. Lowest Projected Point

So `KPICard` (generic) seems to be the placeholder or the one being replaced by `Real Monthly Surplus` (which is feature 006).
Feature 006 spec says "Create a highlight card... Monthly Surplus".
Feature 007 spec says "Create a highlight card... Lowest Projected Point".

If I follow the constitution (the ultimate source of truth for architecture):
Card 1: Current Balance
Card 2: Real Monthly Surplus
Card 3: Lowest Projected Point

So `Overview.vue` currently has:
1. Current Balance
2. Generic KPI (Monthly Change) -> **Should be replaced by Monthly Surplus (Feature 006) or Lowest Point (Feature 007)?**
3. Monthly Surplus (Feature 006 implemented?) -> It seems `MonthlySurplusCard` is already there (line 101).

So I should replace the Generic KPI card (middle one) with `LowestPointCard`?
Or is `MonthlySurplus` supposed to be the 2nd and `LowestPoint` the 3rd?
In `Overview.vue` now:
Left: Current Balance
Middle: Generic KPI (Change/Avg)
Right: Monthly Surplus

If I change Middle to Lowest Point, then I have:
Left: Balance
Middle: Lowest Point
Right: Surplus

If I follow constitution order:
1. Balance
2. Surplus
3. Lowest Point

So I should:
1. Keep `CurrentBalance` (Left).
2. Move `MonthlySurplus` to Middle.
3. Place `LowestPoint` at Right.

I will document this layout adjustment in the Plan/Research.
