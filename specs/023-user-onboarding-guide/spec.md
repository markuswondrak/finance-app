# Feature Specification: User Onboarding Guide

**Feature Branch**: `023-user-onboarding-guide`
**Created**: 2025-12-30
**Status**: Draft
**Input**: User description: "As a newly created user I want to be guided through the steps to use the finanz app efficiently. It should describe in easy language where every functionality can be accessed and how it works"

## Clarifications

### Session 2025-12-30

- Q: What presentation format should the welcome guide use? → A: Step-through wizard (multi-step modal with Next/Back buttons)
- Q: Where should onboarding status be stored? → A: Backend (user profile in database, syncs across devices)
- Q: Should visual examples be included in the guide? → A: Yes, static screenshots showing each feature's UI

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time User Discovers App Features (Priority: P1)

As a newly registered user, I want to see a welcome guide that introduces me to the main features of the Finanz app, so that I understand what the app can do for me and where to find each feature.

**Why this priority**: This is the entry point for all new users. Without understanding what features exist and where they are located, users cannot effectively use the app. This directly addresses the core user request.

**Independent Test**: Can be fully tested by creating a new user account and verifying the welcome guide appears with clear descriptions of all main features.

**Acceptance Scenarios**:

1. **Given** a user has just completed registration, **When** they land on the app for the first time, **Then** they see a welcome guide introducing the five main features (Overview, Wealth, Save-to-Spend, Fixed Costs, Special Costs).
2. **Given** a user is viewing the welcome guide, **When** they read about a feature, **Then** they see the feature name, its location in the navigation, and a brief explanation of what it does in simple language.
3. **Given** a user has viewed the welcome guide, **When** they dismiss it, **Then** they can access it again from the settings or help section.

---

### User Story 2 - User Learns Feature Functions (Priority: P2)

As a new user, I want to understand how each feature works through step-by-step explanations, so that I can use the app effectively without confusion.

**Why this priority**: After knowing what features exist, users need to understand how to use them. This builds on the feature discovery and enables productive app usage.

**Independent Test**: Can be fully tested by navigating to each feature page and verifying that clear usage instructions are available.

**Acceptance Scenarios**:

1. **Given** a user is viewing the guide for a specific feature, **When** they read the explanation, **Then** they see step-by-step instructions on how to use that feature.
2. **Given** a user is reading about the Overview feature, **When** they view the explanation, **Then** they understand how to view their balance forecast and interpret the chart.
3. **Given** a user is reading about the Fixed Costs feature, **When** they view the explanation, **Then** they understand how to add costs with different frequencies (monthly, quarterly, half-yearly, yearly).
4. **Given** a user is reading about the Save-to-Spend feature, **When** they view the explanation, **Then** they understand how to enter their balance, track pending costs, and see their available spending money.
5. **Given** a user is reading about the Wealth feature, **When** they view the explanation, **Then** they understand how to set their current wealth, forecast horizon, and expected returns.
6. **Given** a user is reading about Special Costs, **When** they view the explanation, **Then** they understand how to track one-time expenses and savings.

---

### User Story 3 - User Accesses Help On-Demand (Priority: P3)

As a user who wants to revisit instructions, I want to access the onboarding guide at any time via a dedicated help section, so that I can refresh my understanding of features whenever needed.

**Why this priority**: While not critical for initial onboarding, persistent access to help improves long-term user satisfaction and reduces support needs. A dedicated help section makes the guide discoverable for existing users.

**Independent Test**: Can be fully tested by logging in as an existing user and accessing the help section from the sidebar navigation.

**Acceptance Scenarios**:

1. **Given** a user is logged in, **When** they look at the sidebar navigation, **Then** they see a Help entry that provides access to the user guide.
2. **Given** a user clicks on the Help section, **When** the help page or modal opens, **Then** they see the same feature explanations available during initial onboarding.
3. **Given** a user is viewing the on-demand guide, **When** they select a specific feature, **Then** they can navigate directly to that feature's detailed explanation.
4. **Given** an existing user who registered before this feature was added, **When** they click on the Help section, **Then** they can view the complete user guide.

---

### User Story 4 - User Understands Navigation (Priority: P4)

As a new user, I want to understand how to navigate the app using the sidebar menu, so that I can quickly find what I need.

**Why this priority**: Navigation understanding supports all other features but is naturally discovered through use. Explicit guidance is helpful but not essential for basic app usage.

**Independent Test**: Can be fully tested by verifying the guide explains sidebar navigation including expanding/collapsing the menu.

**Acceptance Scenarios**:

1. **Given** a user is viewing the navigation guide, **When** they read about the sidebar, **Then** they understand that icons on the left side represent different features.
2. **Given** a user reads about sidebar behavior, **When** they see the explanation, **Then** they understand how to expand the sidebar to see feature names alongside icons.
3. **Given** a user reads about mobile navigation, **When** they view the explanation, **Then** they understand how to access the menu on mobile devices.

---

### Edge Cases

- What happens when a user skips the initial welcome guide by accident?
  - Users can always access the guide from the Help section in the sidebar.
- How does the system handle users who have already been using the app but want to see the guide?
  - The guide is accessible on-demand via the Help section regardless of account age.
- What happens if the app adds new features after a user has seen the guide?
  - Users are notified of new features and can view updated guide content via the Help section.
- How do existing users (registered before this feature) access the guide?
  - The Help section is available to all authenticated users, regardless of when they registered.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a welcome guide to users on their first login after registration.
- **FR-002**: System MUST provide explanations for all five main features: Overview (Überblick), Wealth (Vermögen), Save-to-Spend (Spielraum), Fixed Costs (Fixkosten), and Special Costs (Sonderkosten).
- **FR-003**: System MUST show where each feature is located in the navigation (sidebar icon and name).
- **FR-004**: System MUST explain in simple, non-technical language what each feature does.
- **FR-005**: System MUST provide step-by-step usage instructions for each feature.
- **FR-006**: Users MUST be able to dismiss the welcome guide at any time.
- **FR-007**: System MUST provide a Help section in the sidebar navigation that is visible to all authenticated users.
- **FR-008**: System MUST allow users to access the complete user guide from the Help section at any time.
- **FR-009**: System MUST remember that a user has viewed the welcome guide to avoid showing it repeatedly on every login.
- **FR-010**: System MUST present guide content in German to match the app's existing language.
- **FR-011**: System MUST explain navigation basics including sidebar expansion and mobile menu access.
- **FR-012**: System MUST present the welcome guide as a step-through wizard with Next/Back navigation buttons and a skip/close option.
- **FR-013**: System MUST display a screenshot image for each feature step showing the actual UI of that feature.

### Key Entities

- **OnboardingStatus**: Tracks whether a user has completed or dismissed the initial onboarding guide. Stored in backend database as part of user profile; syncs across devices.
- **GuideContent**: The educational content explaining each feature, including feature name, description, location, and step-by-step usage instructions.
- **FeatureSection**: Individual feature explanation block containing the feature's purpose, navigation location, and how-to steps.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 80% of new users view at least one feature explanation in the onboarding guide during their first session.
- **SC-002**: Users can complete the full onboarding guide in under 5 minutes.
- **SC-003**: 90% of users who view the onboarding guide successfully use at least one feature within their first session.
- **SC-004**: Reduce support inquiries about basic app navigation by 50% within three months of deployment.
- **SC-005**: User satisfaction rating for onboarding experience averages 4 out of 5 or higher.
- **SC-006**: Users who complete the onboarding guide demonstrate 30% higher feature adoption compared to those who skip it.

## Assumptions

- The app's five main features (Overview, Wealth, Save-to-Spend, Fixed Costs, Special Costs) remain the core feature set during implementation.
- Guide content will be written in German to match the existing app language.
- The onboarding status will be stored in the backend database as part of the user profile, enabling synchronization across all devices and browsers.
- The welcome guide appears as a step-through wizard (multi-step modal with Next/Back buttons) allowing users to progress at their own pace.
- Users can navigate directly to features mentioned in the guide by clicking on them.
- Mobile users receive the same guide content with responsive presentation.
- The Help section will be added to the sidebar navigation alongside existing menu items.
- Existing users who registered before this feature is deployed will have full access to the Help section and user guide.
