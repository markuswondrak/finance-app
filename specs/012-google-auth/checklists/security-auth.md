# Checklist: Security & Authentication Requirements

**Feature**: Google Authentication (012-google-auth)
**Purpose**: Validate quality, completeness, and security rigor of authentication requirements.
**Created**: 2025-12-19

## Requirement Completeness
- [ ] CHK001 - Are the exact Google OAuth scopes (e.g., `email`, `profile`, `openid`) explicitly listed? [Gap]
- [ ] CHK002 - Is the JWT token expiration duration (e.g., 15 min, 24 hours) explicitly defined? [Gap]
- [ ] CHK003 - Are error handling requirements defined for OAuth callback failures (e.g., "access_denied")? [Completeness]
- [ ] CHK004 - Are requirements specified for handling users who revoke Google permissions external to the app? [Edge Case, Gap]
- [ ] CHK005 - Is the behavior for "Session Expiry" explicitly defined (e.g., auto-redirect vs inline warning)? [Completeness]

## Security & Data Privacy
- [ ] CHK006 - Are "HTTP-Only", "Secure", and "SameSite" cookie attributes explicitly required? [Traceability, Spec §FR-008]
- [ ] CHK007 - Is the "Login Guard" requirement explicitly applied to *all* future protected routes, not just current ones? [Consistency, Spec §FR-007]
- [ ] CHK008 - Is data isolation (filtering by UserID) required for *every* data access operation? [Security, Spec §SC-003]
- [ ] CHK009 - Are requirements defined for clearing sensitive session data on logout? [Completeness, Spec §SC-004]
- [ ] CHK010 - Is the storage of PII (Name, Email, Avatar) justified and limited to necessary fields? [Privacy]

## Requirement Clarity & consistency
- [ ] CHK011 - Is the distinction between "Register" and "Login" flows clear in terms of backend logic (or lack thereof)? [Clarity, Spec Assumption]
- [ ] CHK012 - Is "Google Service Down" behavior defined with specific user-facing error messages? [Clarity, Edge Case]
- [ ] CHK013 - Are "Persistent Session" requirements consistent with security best practices (e.g., refresh tokens)? [Consistency, Spec §FR-008]
- [ ] CHK014 - Is the "Guest Data" handling (clearing/ignoring) explicitly documented to prevent data leaks? [Clarity, Spec Assumption]

## UX & Edge Cases
- [ ] CHK015 - Are loading states defined for the period between clicking "Login" and redirecting? [Gap]
- [ ] CHK016 - Are requirements defined for users with existing accounts trying to "Register" again? [Edge Case]
- [ ] CHK017 - Is the fallback behavior specified if the Google Avatar URL fails to load? [Edge Case, Gap]
- [ ] CHK018 - Are requirements defined for users navigating back to the login page while already authenticated? [Coverage, User Story 2]

## Dependencies & Assumptions
- [ ] CHK019 - Is the assumption about "No automated migration" clearly communicated to stakeholders? [Assumption]
- [ ] CHK020 - Are dependencies on specific Google Identity Services SDK versions documented? [Dependency, Gap]
