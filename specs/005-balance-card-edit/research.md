# Research: Current Balance Card with Click-to-Edit

**Feature**: 005-balance-card-edit
**Date**: 2025-12-15

## Unknowns & Clarifications

### 1. Backend Persistence Strategy
**Question**: How should the "Current Balance" be stored?
**Investigation**: Checked `backend/internal/models` and `01_init.sql`. No user model exists.
**Decision**: Create a new `User` model (`backend/internal/models/user.go`) with a `CurrentAmount` field. Since this is a single-user app for now, we can either hardcode ID 1 or just use the first record.
**Rationale**: Keeps the domain model clean. A `User` entity is the natural place for global user settings/state like starting capital.

### 2. API Endpoint Registration
**Question**: Where to register the new `PUT /user/current-amount` endpoint?
**Investigation**: `backend/cmd/server/main.go` initializes the `gin` router.
**Decision**: Register the route in `backend/cmd/server/main.go`. Create a new handler in `backend/internal/api/user.go` (new file).
**Rationale**: Follows existing pattern in `main.go`.

### 3. Frontend Data Flow
**Question**: How to trigger forecast chart recalculation?
**Investigation**: `ForecastChart.vue` gets data via props from `Overview.vue`. `Overview.vue` fetches data from `/api/overview/all` (which seems to be the endpoint, though `overview.go` suggests just `/overview`).
**Decision**:
1. Create `CurrentBalanceCard.vue`.
2. Emit an event (e.g., `balance-updated`) from the card up to `Overview.vue`.
3. `Overview.vue` listens for this event and calls `this.fetchData()` again.
**Rationale**: Preserves the unidirectional data flow. `Overview.vue` remains the source of truth for the dashboard.

### 4. Renaming "Current Balance" in Fixed Costs
**Question**: Where is the conflicting label?
**Investigation**: `frontend/src/components/FixedCosts.vue` contains `<span class="text-body-2 text-medium-emphasis mr-2">Aktuelle Bilanz (pro Monat):</span>`.
**Decision**: Rename to "Monatlicher Überschuss" (Monthly Surplus) or "Summe Fixkosten" (Sum Fixed Costs). "Bilanz" is misleading if it's just monthly cash flow. Let's go with "Monatlicher Überschuss" as it represents Income - Fixed Costs.
**Rationale**: "Current Balance" (Starting Capital) vs "Monthly Balance" (Cash flow) is confusing.

## Technical Decisions

| Decision | Context | Rationale |
|----------|---------|-----------|
| **New `User` Entity** | Backend Model | Needed to store the starting capital. Will be extensible for future user settings. |
| **New `user.go` API Handler** | Backend API | Keep user-related logic separate from costs/overview. |
| **Event Bus / Props** | Frontend | Use Vue events to notify parent (`Overview.vue`) to reload data. |
| **Vuetify Dialog** | UI | Use `<v-dialog>` for the edit modal, consistent with existing UI. |
