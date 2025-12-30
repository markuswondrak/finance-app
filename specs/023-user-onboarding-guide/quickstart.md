# Quickstart: User Onboarding Guide

**Feature**: 023-user-onboarding-guide
**Date**: 2025-12-30

## Prerequisites

- Docker and Docker Compose running
- Node.js 18+ for frontend development
- Go 1.17+ for backend development

## Quick Setup

### 1. Start Development Environment

```bash
# From repository root
docker-compose up -d db
cd backend && go run cmd/server/main.go &
cd frontend && npm run dev
```

### 2. Database Migration

The `OnboardingCompleted` field will be automatically added when the backend starts (GORM AutoMigrate).

To verify:
```bash
docker exec -it finance-db psql -U postgres -d financedb -c "\d users"
```

Expected output includes:
```
 onboarding_completed | boolean | default false
```

## Implementation Order

### Backend (Do First)

1. **Add field to User model** (`backend/internal/user/model.go`)
   ```go
   OnboardingCompleted bool `json:"onboarding_completed" gorm:"default:false"`
   ```

2. **Add repository method** (`backend/internal/storage/userRepo.go`)
   ```go
   func (r *UserRepoGorm) UpdateOnboardingStatus(userID uint, completed bool) error
   ```

3. **Add API handler** (`backend/internal/user/api/handler.go`)
   ```go
   func (h *Handler) UpdateOnboardingStatus(c *gin.Context)
   ```

4. **Register route** (`backend/internal/api/server.go`)
   ```go
   userGroup.PATCH("/onboarding-status", userHandler.UpdateOnboardingStatus)
   ```

5. **Write tests** (`backend/tests/user/onboarding_test.go`)

### Frontend (Do Second)

1. **Create wizard component** (`frontend/src/components/help/OnboardingWizard.vue`)
   - Step-through modal using v-dialog + v-window
   - 7 steps with Next/Back/Skip buttons

2. **Create help page** (`frontend/src/components/help/HelpPage.vue`)
   - Button to open wizard on demand

3. **Add route** (`frontend/src/router/index.js`)
   ```javascript
   { path: '/help', component: HelpPage, meta: { requiresAuth: true } }
   ```

4. **Update sidebar** (`frontend/src/components/navigation/AppSidebar.vue`)
   - Add Help nav item with fa-circle-question icon

5. **Add user service method** (`frontend/src/services/user.js`)
   ```javascript
   async updateOnboardingStatus(completed) { ... }
   ```

6. **Trigger wizard on first login** (`frontend/src/App.vue` or main layout)
   - Check user.onboarding_completed after auth
   - Show wizard if false

7. **Write tests** (`frontend/tests/components/help/OnboardingWizard.test.js`)

## Testing the Feature

### Manual Testing Checklist

- [ ] New user sees wizard on first login
- [ ] Wizard shows all 7 steps
- [ ] Next/Back buttons navigate correctly
- [ ] Skip button closes wizard and marks complete
- [ ] Finish button closes wizard and marks complete
- [ ] Wizard doesn't appear on subsequent logins
- [ ] Help section visible in sidebar
- [ ] Clicking Help opens wizard again
- [ ] Works on mobile viewport

### Reset Onboarding for Testing

```bash
# Reset onboarding status for a specific user
docker exec -it finance-db psql -U postgres -d financedb -c \
  "UPDATE users SET onboarding_completed = false WHERE email = 'test@example.com'"
```

## API Testing

### Update Onboarding Status

```bash
# With valid auth cookie
curl -X PATCH http://localhost:8082/api/user/onboarding-status \
  -H "Content-Type: application/json" \
  -d '{"completed": true}' \
  --cookie "auth_token=<jwt>"
```

Expected response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "onboarding_completed": true,
  ...
}
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/internal/user/model.go` | User entity with new field |
| `backend/internal/user/api/handler.go` | API endpoint handler |
| `frontend/src/components/help/OnboardingWizard.vue` | Wizard UI component |
| `frontend/src/components/help/HelpPage.vue` | Help section page |
| `frontend/src/components/navigation/AppSidebar.vue` | Navigation update |

## Troubleshooting

### Wizard not appearing

1. Check user's onboarding_completed status in database
2. Verify auth cookie is being sent with requests
3. Check browser console for errors

### Database field not created

1. Restart backend to trigger AutoMigrate
2. Check GORM logs for migration errors

### API returns 401

1. Ensure auth middleware is applied to route
2. Verify JWT cookie is valid and not expired
