# Research: Redesign table interface with Action Bar

## Findings

### Component Structure
- **Fixed Costs**: `FixedCostsPage.vue` passes data to `FixedCostTable.vue`. `FixedCostTable` uses `BaseTable` and puts the "Add" button in the `#actions` slot.
- **Special Costs**: `SpecialCostsPage.vue` uses `BaseTable` directly and puts the "Add" button in the `#actions` slot.
- **BaseTable**: Simply renders the `#actions` slot below the table.

### Data Loading
- **Fixed Costs**: Loads all data via `/api/costs` on mount.
- **Special Costs**: Loads all data via `getSpecialCosts` service on mount.
- **Conclusion**: Data sets are relatively small (personal finance), so client-side filtering is performant and responsive. No new API endpoints needed for server-side filtering.

### UX/UI Strategy
- **Action Bar**: A new reusable component `TableActionBar.vue` is best.
- **Responsiveness**: Use Vuetify's Grid system (`v-row`, `v-col`) to stack elements on mobile (`cols="12" md="4"`).
- **Filtering**:
  - **Year**: Dropdown. Default to current year.
  - **Search**: Text field. Immediate filtering.

## Decisions

- **Decision**: Implement `TableActionBar` as a "dumb" component that emits events/updates props.
- **Rationale**: Keeps state management in the parent pages (`FixedCostsPage`, `SpecialCostsPage`) where the data resides.
- **Decision**: Remove `#actions` slot usage from tables.
- **Rationale**: The spec requires the button to be at the top right in the Action Bar.

## Alternatives Considered

- **Server-side filtering**: Rejected. Adds unnecessary latency and complexity for small datasets.
- **Modifying BaseTable**: Rejected. Action Bar should be outside the table component to separate controls from data presentation.
