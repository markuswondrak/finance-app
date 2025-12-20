# Research & Technical Decisions

## Technology Stack Confirmation

- **Backend**: Go 1.17+ with Gin and GORM. This aligns with the existing project structure and provides robust type safety and performance.
- **Frontend**: Vue.js 3.3+ with Vuetify 3.3+. This ensures consistency with the current "Fintech Dark Mode" UI.
- **Database**: PostgreSQL 15+.

## Key Decisions

### 1. Database Schema
- **Decision**: Create a dedicated `wealth_profiles` table.
- **Rationale**: Keeps the `users` table clean and allows for potential future expansion (e.g., historical profiles) without cluttering the main user entity.
- **Constraint**: A `UNIQUE` constraint on the `user_id` column ensures strict 1:1 relationship for the MVP.

### 2. Frontend Component Selection
- **Component**: `v-expansion-panels` with a single `v-expansion-panel`.
- **Rationale**: Satisfies the requirement for a collapsible interface that doesn't obscure the main content (future charts) when closed, but provides ample space for editing when open.
- **Validation**: Use Vuetify's `rules` prop for inline validation (e.g., `v => v >= 0 || 'Must be positive'`).

### 3. API Design
- **Endpoints**:
    - `GET /api/wealth-profile`: Retrieve the current user's profile. Returns 404 if not set, or 200 with default values (handled by frontend or backend logic).
    - `PUT /api/wealth-profile`: Upsert (Update or Insert) the profile.
- **Rationale**: Simplified RESTful interface. Using `PUT` implies idempotency and "update or create" logic which fits the "single profile" constraint well.

## Alternatives Considered

- **Storing in `users` table**: Rejected to avoid "God object" anti-pattern.
- **JSON Blob**: Rejected because these fields are core inputs for calculation logic that might need SQL-level querying or aggregation in the future.
