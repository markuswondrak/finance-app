# Implementation Plan: Google Authentication

**Branch**: `012-google-auth` | **Date**: 2025-12-19 | **Spec**: [specs/012-google-auth/spec.md](../specs/012-google-auth/spec.md)
**Input**: Feature specification from `/specs/012-google-auth/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature implements **Google OAuth 2.0 authentication** to enable secure user registration and login. It introduces a multi-user architecture where financial data (FixedCosts, SpecialCosts) is strictly isolated per user.

**Key Components**:
- **Frontend**: "Login" and "Register" buttons initiating the OAuth flow; session handling via HTTP-only cookies; Top-bar user profile display.
- **Backend**: OAuth callback handler exchanging codes for tokens; JWT generation and cookie management; Middleware for route protection; Database schema updates for User entity and ownership associations.

## Technical Context

**Language/Version**: Go 1.17+ (Backend), Vue.js 3.3+ (Frontend)
**Primary Dependencies**:
- Backend: `github.com/gin-gonic/gin` (Web Framework), `golang.org/x/oauth2` (OAuth), `github.com/golang-jwt/jwt/v5` (JWT).
- Frontend: `vue3-google-login` (or similar SDK wrapper)
**Storage**: PostgreSQL 15+ (Existing schema extended with `users` table)
**Testing**: Go standard `testing` + `testify`; `vitest` for frontend.
**Target Platform**: Linux server (Dockerized)
**Project Type**: Web Application (Frontend + Backend)
**Performance Goals**: Login < 2s (excluding Google latency); JWT verification < 1ms.
**Constraints**: Security-first (HTTP-only cookies, PKCE); No migration of legacy "guest" data.
**Scale/Scope**: ~1000s of users; Data isolation is critical.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Simplicity First**: Uses standard OAuth flow and libraries; avoids complex custom auth logic.
- [x] **User Experience Excellence**: Simple "One-click" login; Persistent sessions; Clear user identity in UI.
- [x] **Full-Stack Separation**: Backend handles auth logic and issues cookies; Frontend only initiates flow and displays state.
- [x] **Test Coverage Mandate**: Unit tests for auth handlers and middleware; Component tests for login button/user menu.
- [x] **API-First Design**: Defined OpenAPI contract for auth endpoints.
- [x] **Data Integrity**: Foreign keys enforce user ownership; Cascading deletes (optional/careful).
- [x] **Visual Design Language**: Matches "Fintech Dark Mode" (Dark user menu, branded login buttons).

## Project Structure

### Documentation (this feature)

```text
specs/012-google-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── auth-api.yaml
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── internal/
│   ├── api/
│   │   ├── auth/          # New: Auth handlers (login, callback, logout, me)
│   │   └── middleware/    # Update: Auth middleware (JWT verification)
│   ├── models/            # Update: User model, FKs on Cost models
│   └── storage/           # Update: User repository
└── main.go                # Update: Route registration

frontend/
├── src/
│   ├── components/
│   │   └── UserMenu.vue   # New: User profile & logout dropdown
│   ├── services/
│   │   └── auth.js        # New: Auth service (getUser, logout)
│   ├── router/
│   │   └── index.js       # Update: Navigation guards
│   └── pages/
│       └── LandingPage.vue # Update: Add Login/Register buttons
```

**Structure Decision**: Standard Go/Vue project structure. Auth logic centralized in `backend/internal/api/auth` and `frontend/src/services/auth.js`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       |            |                                     |