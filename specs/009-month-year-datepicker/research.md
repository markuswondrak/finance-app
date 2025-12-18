# Research: Month Year Datepicker

**Feature**: Month Year Datepicker
**Status**: In Progress

## Research Tasks

- [ ] **Research Vuetify 3 Month/Year Selection**: Determine the best way to implement a Month/Year only picker in Vuetify 3.3+.
  - *Context*: Need to avoid day selection entirely.
  - *Questions*: Does `v-date-picker` support a "month" only mode? Is composing `v-select` (Month) and `v-select` (Year) inside a `v-menu` better for UX/Code quality?
- [ ] **Research Backend Date Normalization**: Confirm how to strictly enforce "First of Month" in Go/GORM when receiving potentially varying date strings or JSON.

## Findings

### Decision: Vuetify 3 Month/Year Implementation
**Decision**: Use `v-date-picker` with `view-mode="month"` if available and stable, otherwise fallback to `v-select` composition within a `v-menu`.
**Rationale**: `v-date-picker` provides the most "calendar-like" feel (Constitution VII). However, Vuetify 3's date picker has undergone changes.
**Investigation**:
- Vuetify 3 `v-date-picker` allows `view-mode="month"`.
- However, often it requires managing the `model-value` carefully to not reset to day view.
- *Alternative*: Custom component using `v-menu` containing a grid of months and a year selector.
**Final Choice**: Custom component wrapping `v-menu` with a layout optimized for Month/Year selection (Year selector + Month grid). This ensures "SC-002: fewer clicks" and "FR-002: NO calendar grid of days". Standard `v-date-picker` often defaults back to days.
**UX Pattern**:
1. Input field (Read-only) -> Click -> Opens Menu.
2. Menu Header: `< < Year > >`.
3. Menu Body: Grid of 12 Months.
4. Click Month -> Selects & Closes.

### Decision: Backend Date Handling
**Decision**: Receive standard ISO-8601 date string (YYYY-MM-DD) or YYYY-MM string. Parse and force Day=1.
**Rationale**: Go's `time.Parse` is strict.
**Pattern**:
- Input: `2025-01` or `2025-01-15`
- Logic: `parsedTime, _ := time.Parse("2006-01", input)` (implicitly day 1) OR if full date, `time.Date(t.Year(), t.Month(), 1, ...)`
- Storage: PostgreSQL `DATE` or `TIMESTAMP`.

### Decision: Input Masking
**Decision**: Display format "January 2026".
**Rationale**: Clearer for users than "2026-01".
