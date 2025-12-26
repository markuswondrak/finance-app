# Quickstart: Shared Finance Workspace

## Prerequisites
- Backend (Go) and Frontend (Vue) services running.
- PostgreSQL database accessible.
- Mailjet API key and secret configured in `.env` as `MAILJET_API_KEY` and `MAILJET_SECRET_KEY`.

## Backend Setup
1. **Migrations**: Run the backend server. GORM will automatically create the `workspaces` and `invites` tables and update `users` and `fixed_costs`.
   ```bash
   cd backend && go run main.go
   ```
2. **Backfill**: Existing users will be assigned a default personal workspace on first login or via migration script.

## Frontend Setup
1. **Install Dependencies**:
   ```bash
   cd frontend && pnpm install
   ```
2. **Run Dev Server**:
   ```bash
   pnpm dev
   ```

## Testing the Flow
1. **Login** with User A.
2. Navigate to **Profile -> User Settings**.
3. **Generate Invite** for User B's email.
4. Check Mailjet/Console for the generated invite link.
5. **Login** with User B in a separate browser/incognito.
6. **Click Invite Link**:
   - If User B has data, confirm the **Destructive Join** modal.
7. Verify User A and User B now see the same data on their respective Dashboards.
8. **Remove User B** from User A's settings and verify User B's access is revoked.
