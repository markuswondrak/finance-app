# API Contracts: Fintech Dark Mode Theme

**Feature Branch**: `001-fintech-dark-theme`

## No API Contracts Required

This feature is **frontend-only** and does not introduce or modify any API endpoints.

### Rationale

- All changes are visual/styling modifications
- No new data is being transmitted to/from the backend
- Existing API responses remain unchanged
- Theme configuration is managed entirely in the frontend

### Affected Layers

| Layer | Changes |
|-------|---------|
| Backend API | None |
| Database | None |
| Frontend Components | Visual styling only |
| Frontend Configuration | Vuetify theme, CSS classes |

### Future Considerations

If a user-selectable theme feature is added later, the following contracts would be needed:
- `GET /api/user/preferences` - Retrieve theme preference
- `PUT /api/user/preferences` - Save theme preference

This is out of scope for the current feature (dark mode is the only theme).
