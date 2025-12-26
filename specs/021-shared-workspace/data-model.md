# Data Model: Shared Finance Workspace

## Entities

### Workspace
Represents a shared financial container.
- `id` (UUID, Primary Key)
- `name` (String): e.g., "Pete's Workspace"
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### User (Updated)
- `workspace_id` (UUID, Foreign Key to Workspace): A user belongs to exactly one workspace.
- `role` (String): (Optional/Future) Currently peer-to-peer, but might store "creator" for naming logic.

### Invite
Represents a pending invitation to join a workspace.
- `token` (String, Unique Index): Secure random token.
- `workspace_id` (UUID, Foreign Key)
- `invited_by` (UUID, Foreign Key to User)
- `email` (String): Recipient email.
- `expires_at` (Timestamp): 24 hours from creation.
- `is_used` (Boolean): Default false.
- `created_at` (Timestamp)

### FixedCost (Updated)
- `workspace_id` (UUID, Foreign Key to Workspace): Ownership moves from User to Workspace.
- `user_id` (UUID, Foreign Key): Optional, tracks who created the record (for history), but not for access control.

## Relationships

- **Workspace 1:N User**: A workspace has many users; a user has one workspace.
- **Workspace 1:N FixedCost**: A workspace owns many financial records.
- **Workspace 1:N Invite**: A workspace can have multiple pending invitations.

## State Transitions

### Joining a Workspace
1. **Validation**: Check if token exists, is unused, and not expired.
2. **Purge**: If user has existing data, delete all records linked to their current personal workspace.
3. **Migration**: Update user's `workspace_id` to the new workspace.
4. **Invalidation**: Mark invite as `is_used = true`.
