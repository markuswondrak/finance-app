# Data Model: Lowest Projected Point Card

**Component**: `LowestPointCard.vue`

## Props

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `entries` | `Array` | Yes | List of forecast entries from API (Overview object). Each entry must have `currentAmount` (int) and `yearMonth` (struct). |
| `loading` | `Boolean` | No | Display loading skeleton state. Default `false`. |

## Computed Properties

| Name | Type | Description |
| :--- | :--- | :--- |
| `minEntry` | `Object` | The entry object from `entries` with the lowest `currentAmount`. |
| `lowestAmount` | `Number` | The value of `minEntry.currentAmount`. |
| `lowestDate` | `String` | `minEntry.yearMonth` formatted as "Month Year" (e.g., "August 2025"). |
| `status` | `String` | 'positive' (>0), 'negative' (<0), or 'neutral' (=0). |
| `variant` | `String` | Maps status to UI variant: 'success', 'risk', 'default'. |
| `formattedAmount` | `String` | `lowestAmount` formatted as currency (e.g., "1.500 €"). |

## Logic

1. **Find Minimum**: `Math.min(...entries.map(e => e.currentAmount))` is insufficient because we need the date.
   - Use `reduce` to find the entry with the minimum `currentAmount`.
2. **Date Formatting**:
   - Convert `yearMonth` (e.g., `{ year: 2025, month: 8 }`) to JS Date: `new Date(year, month - 1)`.
   - Format: `new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(date)`.
   - Prepend "im " manually if desired, but "August 2025" is standard. Spec said "im August 2025" in clarification. I will append "im ".
3. **Styling**:
   - `status === 'negative'`: Icon `mdi-alert-circle`, Color `text-error`.
   - `status === 'positive'`: No icon, Color `text-success`.
   - `status === 'neutral'`: No icon, Color `text-grey`.

## Integration

**Parent**: `Overview.vue`

**Layout Update**:
- Slot 1: `CurrentBalanceCard` (Existing)
- Slot 2: `MonthlySurplusCard` (Move from Slot 3)
- Slot 3: `LowestPointCard` (New)

**Removed**:
- `KPICard` (Generic "Monthly Change" placeholder) is removed to make space.
