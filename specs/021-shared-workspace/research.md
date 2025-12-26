# Research: Shared Finance Workspace

## Decisions & Rationale

### 1. Invite Token Generation
- **Decision**: Use `crypto/rand` to generate a 32-byte secure random token, encoded as a URL-safe base64 string.
- **Rationale**: Provides high entropy and is standard practice for secure identifiers.
- **Alternatives considered**: UUID v4 (less secure against brute force for tokens), JWT (stateless but harder to revoke immediately once used).

### 2. Mailjet Integration
- **Decision**: Use the official Mailjet Go library (`mailjet/mailjet-apiv3-go`). Secrets managed via environment variables.
- **Rationale**: User-specified provider for reliable email delivery.
- **Alternatives considered**: SendGrid (rejected as per updated requirements).

### 3. Data Migration & Purge (Destructive Join)
- **Decision**: Use a single GORM transaction to:
    1. Delete all `FixedCosts` and other user-related data owned by the joining user.
    2. Update the `Users` table with the new `workspace_id`.
- **Rationale**: Ensures atomicity. If deletion fails, the user isn't moved to the new workspace in a corrupted state.
- **Alternatives considered**: Soft delete (increases DB size unnecessarily for this use case), background worker (too complex, immediate consistency preferred for UX).

### 4. Workspace-Level Authorization Middleware
- **Decision**: Implement a Gin middleware that extracts `workspace_id` from the authenticated user and injects it into the Gin context (`c.Set("workspace_id", ...)`).
- **Rationale**: Centralizes security. All downstream handlers can retrieve the ID from the context and filter queries accordingly.
- **Alternatives considered**: Passing user object everywhere (less clean).

### 5. Schema Migration Strategy
- **Decision**: 
    1. Add `Workspaces` table.
    2. Add `workspace_id` to `Users` and `FixedCosts`.
    3. Backfill: For every existing user, create a workspace and link them.
    4. Remove `user_id` from `FixedCosts` after successful migration.
- **Rationale**: Follows standard relational data modeling for multi-tenancy.
- **Alternatives considered**: Keep `user_id` as primary owner (violates peer-to-peer requirement).

## Technology Best Practices

- **Go (Gin/GORM)**: Use `c.MustGet("workspace_id")` in handlers. Ensure all GORM queries include `.Where("workspace_id = ?", workspaceID)`.
- **Vue.js**: Use a dedicated `Settings` page component. Store `workspace_id` in the user profile state (Pinia/Vuex if used, or reactive object).
- **Security**: Always validate that the `workspace_id` of the resource being accessed matches the `workspace_id` of the authenticated user.
