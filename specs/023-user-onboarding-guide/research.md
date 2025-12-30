# Research: User Onboarding Guide

**Feature**: 023-user-onboarding-guide
**Date**: 2025-12-30

## Research Tasks

### 1. Onboarding Status Storage in User Model

**Decision**: Add `onboarding_completed` boolean field to existing User model

**Rationale**:
- The existing User model in `/backend/internal/user/model.go` already contains user profile data
- GORM supports automatic migrations, so adding a field is straightforward
- Boolean is simpler than string status (not_started/in_progress/completed) since we only need to track "has seen guide"
- The `auth/me` endpoint already returns the full user object, so no additional API needed for reading status

**Alternatives Considered**:
- Separate OnboardingProgress table: Rejected - over-engineering for a simple boolean flag
- LocalStorage: Rejected - spec requires cross-device sync
- String enum status: Rejected - no business need to track "in progress" state separately

### 2. Step-Through Wizard Implementation Pattern

**Decision**: Use Vuetify `v-dialog` with `v-window` component for step navigation

**Rationale**:
- `v-dialog` provides modal behavior with proper focus management and accessibility
- `v-window` (formerly v-stepper) provides built-in step navigation with animations
- Both are already available in Vuetify 3.3+ (project dependency)
- Pattern matches existing modal dialogs in the app (e.g., BalanceEditModal, EditWealthModal)

**Alternatives Considered**:
- Vue Tour library: Rejected - adds external dependency, tooltip-style doesn't match modal requirement
- Custom stepper: Rejected - Vuetify provides this out of the box
- Full-page wizard: Rejected - clarification specified modal-based step-through

### 3. Help Section Navigation Integration

**Decision**: Add Help item to AppSidebar navigation with link to `/help` route

**Rationale**:
- Follows existing navigation pattern in AppSidebar.vue
- Uses same icon + label structure as other nav items
- Route-based approach allows bookmarking and direct access
- Help page can host the wizard trigger and future help content

**Alternatives Considered**:
- Modal-only (no route): Rejected - less discoverable, can't bookmark
- Floating help button: Rejected - clutters UI, not consistent with existing patterns
- Settings page integration: Rejected - spec explicitly requires dedicated Help section in sidebar

### 4. Wizard Content Structure

**Decision**: 7 steps total with consistent structure

**Rationale**:
- Step 1: Welcome (intro to guide purpose)
- Step 2-6: One step per feature (Overview, Wealth, Save-to-Spend, Fixed Costs, Special Costs)
- Step 7: Navigation basics (sidebar, mobile menu)
- Each step shows: Feature name (German), icon, location hint, brief description, key actions

**Alternatives Considered**:
- Fewer combined steps: Rejected - spec requires individual feature explanations
- More granular steps: Rejected - would exceed 5-minute completion target

### 5. Auto-Display Trigger Logic

**Decision**: Check `onboarding_completed` flag after authentication, trigger wizard if false

**Rationale**:
- Auth flow already fetches user via `/auth/me` endpoint
- Adding check in App.vue or main layout after user load is minimal code
- Existing users (onboarding_completed defaults to false via migration) will see guide once
- After viewing, flag is set to true and wizard won't auto-appear again

**Alternatives Considered**:
- Cookie-based check: Rejected - doesn't sync across devices
- Check on every page: Rejected - unnecessary overhead, once on app load is sufficient

### 6. API Endpoint Design

**Decision**: Single PATCH endpoint for updating onboarding status

**Rationale**:
- `PATCH /api/user/onboarding-status` with body `{ "completed": true }`
- Follows REST conventions for partial updates
- Single-purpose endpoint is simpler than generic profile update
- Can be called when user completes OR skips the wizard

**Alternatives Considered**:
- PUT /api/user with full profile: Rejected - over-fetching, not needed for single flag
- POST /api/user/onboarding/complete: Rejected - POST implies creation, PATCH is more accurate

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Vuetify | 3.3+ | v-dialog, v-window components for wizard UI |
| Vue Router | 4.2+ | /help route registration |
| GORM | 1.21+ | User model migration |

## Implementation Notes

1. **Database Migration**: GORM AutoMigrate will add the new field. Default value `false` ensures existing users see the guide.

2. **Backward Compatibility**: Existing users without the field will have it default to `false`, triggering the guide once.

3. **Content Localization**: All wizard content hardcoded in German per spec. No i18n framework needed for this feature.

4. **Mobile Responsiveness**: Vuetify dialog and window components are responsive by default. May need max-width adjustment for desktop.

5. **Test Strategy**:
   - Backend: Test PATCH endpoint returns 200, updates user, handles auth errors
   - Frontend: Test wizard renders all steps, navigation works, completion triggers API call
