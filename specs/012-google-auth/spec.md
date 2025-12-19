# Feature Specification: Google Authentication

**Feature Branch**: `012-google-auth`  
**Created**: 2025-12-19  
**Status**: Draft  
**Input**: User description: "add the log in with google functionality to the application. The register button is found on the landing page. a dedicated user for each autheniticated user will be created in the database and all costs created will be assigned to that user. Only authenticated and registered users will be able to view the overview, fixedcost, specialcost pages. If a user is not authenticated he will be redirected to the landing page. add a login button to the page for already existing users to be able to access the main application"

## Clarifications

### Session 2025-12-19

- Q: What user profile data should be stored from Google? → A: Store Name & Avatar (Option A)
- Q: How should the session be managed between frontend and backend? → A: HTTP-only Cookie with JWT (Option A)
- Q: How should existing data (without a UserID) be handled? → A: Clear Guest Data (Option A)
- Q: Where should the logged-in user info and logout option be placed? → A: Top-Right Avatar Menu (Option A)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New User Registration (Priority: P1)

As a new visitor to the finance app, I want to register using my Google account so that I can create a secure, personal space for my financial data.

**Why this priority**: Essential for onboarding new users and establishing the multi-user architecture.

**Independent Test**: Verify that a fresh user can click "Register", complete the Google OAuth flow, and be redirected to the Overview page with a new, empty user account created in the database.

**Acceptance Scenarios**:

1. **Given** a visitor is on the landing page, **When** they click "Register with Google", **Then** they are redirected to Google's authentication provider.
2. **Given** a successful Google authentication for a new email, **When** the user is redirected back to the app, **Then** a new User record is created in the database and the user sees the Overview page.
3. **Given** a visitor initiates registration, **When** they decline/cancel at Google, **Then** they are returned to the landing page without being logged in.

---

### User Story 2 - Existing User Login (Priority: P1)

As a returning user, I want to log in with my Google account so that I can access my previously saved financial data.

**Why this priority**: Crucial for retaining users and allowing access to their data across sessions.

**Independent Test**: Verify that a user with an existing account can click "Login", complete the Google OAuth flow, and see their specific pre-existing data on the Overview page.

**Acceptance Scenarios**:

1. **Given** a visitor is on the landing page, **When** they click "Log in with Google", **Then** they are redirected to Google's authentication provider.
2. **Given** a successful Google authentication for an existing email, **When** the user is redirected back, **Then** they are logged in and see the Overview page with their existing data.
3. **Given** a user is logged in, **When** they navigate to the landing page, **Then** they should be redirected to the Overview page (or see a "Go to App" button).

---

### User Story 3 - Access Control & Protection (Priority: P1)

As a site administrator/owner, I want to ensure only authenticated users can access the application pages so that user data remains private.

**Why this priority**: Security requirement to prevent unauthorized data access.

**Independent Test**: Attempt to access `/overview`, `/fixedcost`, and `/specialcost` in an incognito window (unauthenticated). The system must redirect to the landing page.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they attempt to visit `/overview`, **Then** they are immediately redirected to the landing page.
2. **Given** an unauthenticated user, **When** they attempt to visit `/fixedcost` or `/specialcost`, **Then** they are immediately redirected to the landing page.

---

### User Story 4 - Data Isolation (Priority: P1)

As an authenticated user, I want my costs to be associated only with my account so that others cannot see my financial details.

**Why this priority**: Core privacy requirement for a multi-user system.

**Independent Test**: Create two distinct users (User A and User B). Have User A add a fixed cost. Log in as User B and verify that User A's fixed cost is NOT visible.

**Acceptance Scenarios**:

1. **Given** User A creates a "Fixed Cost", **When** User B logs in, **Then** User B does not see User A's cost in their list.
2. **Given** an authenticated user creates a "Special Cost", **When** the cost is saved, **Then** it is persisted with a strict association to that user's ID.

### Edge Cases

- **Google Service Down**: If Google auth fails or is unreachable, the user should see a friendly error message on the landing page.
- **Revoked Access**: If a user revokes the app's access in their Google Account settings, the next login attempt should re-prompt for consent or handle the error gracefully.
- **Session Expiry**: When a user's session expires, any action on protected pages should redirect them to the landing page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Landing Page MUST display two distinct buttons: "Register" (or "Sign Up") and "Log In", both triggering the Google OAuth flow.
- **FR-002**: The system MUST implement Google OAuth 2.0 authentication strategy.
- **FR-003**: Upon successful authentication of a *new* user (via Register or Login flow), the system MUST create a unique User record in the database linked to the Google ID/Email.
- **FR-004**: Upon successful authentication of an *existing* user, the system MUST retrieve the corresponding User record and establish a session.
- **FR-005**: All new cost entries (Fixed Costs, Special Costs) MUST be stored with a reference to the currently authenticated User ID.
- **FR-006**: Queries for costs (Overview, Fixed Costs, Special Costs) MUST be filtered to return only records belonging to the currently authenticated User.
- **FR-007**: The system MUST enforce a "Login Guard" on the `/overview`, `/fixedcost`, and `/specialcost` routes; unauthenticated access MUST redirect to the landing page (`/`).
- **FR-008**: The system MUST support persistent sessions using secure, HTTP-only cookies containing a JWT, so users don't have to log in on every page refresh.
- **FR-009**: The system MUST display the logged-in user's Name and Avatar in the top-right corner of the application layout, with a dropdown menu containing a "Log Out" option.

### Key Entities

- **User**: Represents a registered account. Attributes: ID (PK), GoogleID (unique), Email, Name, AvatarURL, CreatedAt.
- **FixedCost**: Existing entity. Needs new relationship: Belongs to **User**.
- **SpecialCost**: Existing entity. Needs new relationship: Belongs to **User**.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can complete the registration flow and land on the Overview page within 30 seconds (excluding Google's own loading times).
- **SC-002**: 100% of unauthenticated requests to protected routes (`/overview`, `/fixedcost`, `/specialcost`) are blocked and redirected to the landing page.
- **SC-003**: Data isolation is verified: A cost created by User A is never returned in a query executed by User B.
- **SC-004**: Users can successfully log out and are returned to the landing page.

## Assumptions

- We are using the existing technology stack (Vue.js frontend, Go backend).
- **Data Migration**: Existing database records without a UserID will be ignored by the application logic (effectively "clearing" guest data for users). No automated migration of legacy data is planned for this iteration.
- "Register" and "Log In" buttons may trigger the same backend OAuth callback handler; the distinction is primarily a UI affordance for the user.