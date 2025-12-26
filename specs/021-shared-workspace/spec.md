# Feature Specification: Shared Finance Workspace

**Feature Branch**: `021-shared-workspace`  
**Created**: 2025-12-26  
**Status**: Draft  
Input: User description: "Move from User-Centric to Workspace-Centric model. Peer-to-peer access. Invite flow with one-time use links. Onboarding flow with destructive join warning. Offboarding flow by removing users. Data model changes: Workspaces, Invites tables, Users and FixedCosts referencing Workspace."

## Clarifications

### Session 2025-12-26
- Q: How are workspaces named? → A: Automatically named after the creator (e.g., "Pete's Workspace").
- Q: What constitutes "Existing Data" for the destructive join warning? → A: Any user-created fixed cost or custom configuration triggers the warning.
- Q: What happens to data created by a user when they are removed? → A: All data created by the user remains in the Workspace (History preserved).
- Q: How are concurrent edits handled? → A: Last Write Wins: The most recent update to the server is the one that is saved.
- Q: Can users voluntarily leave a workspace? → A: Voluntary Exit: Users can choose to "Leave Workspace" themselves at any time.
- Q: Which email provider should be used? → A: Mailjet.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Join Workspace (Priority: P1)

Pete wants to share his household finances with his new housemate, Josh. Pete generates an invite link and sends it to Josh. Josh clicks the link, signs in, and joins Pete's workspace.

**Why this priority**: This is the core mechanism that enables shared access and the shift to a workspace-centric model.

**Independent Test**: Can be tested by generating a token, using it with a new user account, and verifying the new user has access to the same data as the inviter.

**Acceptance Scenarios**:

1. **Given** Pete is in a workspace, **When** Pete generates an invite link, **Then** a unique, one-time use token is created.
2. **Given** Josh has a valid invite link, **When** Josh clicks the link and authenticates, **Then** Josh is added to Pete's workspace.
3. **Given** Josh has joined Pete's workspace, **When** Josh views his dashboard, **Then** he sees the same financial data as Pete.

---

### User Story 2 - Destructive Join Warning (Priority: P1)

Josh already has some fixed costs set up in his own account. When he clicks Pete's invite link, the system warns him that joining Pete's workspace will permanently delete his existing data. Josh confirms, his old data is purged, and he joins Pete's workspace.

**Why this priority**: Essential for data integrity and preventing accidental data loss while ensuring the user starts with a clean slate in the new workspace.

**Independent Test**: Can be tested by inviting a user who already has data and verifying the warning modal appears and data is indeed purged upon confirmation.

**Acceptance Scenarios**:

1. **Given** Josh has existing costs, **When** Josh attempts to join a workspace via invite, **Then** a high-friction "Destructive Join" modal is displayed.
2. **Given** the modal is displayed, **When** Josh clicks "Confirm & Join", **Then** his previous personal costs are deleted and he is added to the new workspace.

---

### User Story 3 - Peer-to-Peer Management (Priority: P2)

Josh is now a member of the workspace. He notices a missing utility bill and adds it. Later, he decides to invite their third housemate, Sarah.

**Why this priority**: Demonstrates the equality of access and the viral growth aspect of the workspace model.

**Independent Test**: Can be tested by having a joined user perform write operations and generate new invites.

**Acceptance Scenarios**:

1. **Given** Josh is a member (not the creator), **When** Josh adds a new cost, **Then** the cost is visible to Pete.
2. **Given** Josh is a member, **When** Josh generates an invite link for Sarah, **Then** a valid link is generated.

---

### User Story 4 - Offboarding and Revocation (Priority: P3)

Josh moves out. Pete removes Josh from the workspace. Josh's access is immediately revoked. Next time Josh logs in, he sees an empty state as if he were a new user.

**Why this priority**: Critical for security and privacy when members leave a shared household/workspace.

**Independent Test**: Can be tested by removing a user and verifying they can no longer access the workspace API and see an empty state on refresh.

**Acceptance Scenarios**:

1. **Given** Pete and Josh are in a workspace, **When** Pete removes Josh, **Then** Josh's access to the workspace data is immediately revoked.
2. **Given** Josh was removed, **When** Josh logs in again, **Then** he is prompted to set up his first cost (empty state).

### Edge Cases

- **What happens when an invite link expires?** The user should see a "Link Expired" message and be unable to join.
- **What happens if two people try to use the same one-time link?** The first person succeeds; the second person sees an "Invite already used" message.
- **How does the system handle a user being removed while they are actively using the app?** Subsequent API calls should return 401/403, and the UI should redirect to the onboarding/empty state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST transition from User-to-Data to User-to-Workspace-to-Data model.
- **FR-002**: System MUST support Peer-to-Peer access where all workspace members have full Read/Write permissions.
- **FR-003**: System MUST generate unique, cryptographically secure invite tokens with a 24-hour expiration.
- **FR-004**: System MUST validate invite tokens for expiration and one-time use status.
- **FR-005**: System MUST display a high-friction confirmation modal if a user attempts to join a workspace while having any existing user-created fixed costs or custom configurations.
- **FR-006**: System MUST permanently delete a user's existing personal data upon joining a new workspace if they confirm the destructive join.
- **FR-007**: System MUST revoke a user's access to workspace data immediately upon their removal from the workspace. All data created by the removed user MUST remain in the workspace.
- **FR-008**: System MUST reset a removed user's state to "new user" (empty state) upon their next interaction/login.
- **FR-009**: System MUST automatically send invite emails via Mailjet to the recipient's address provided by the user during link generation.
- **FR-011**: Workspaces MUST be automatically named after the creator (e.g., "[Creator Name]'s Workspace").
- **FR-012**: System MUST handle concurrent edits using a "Last Write Wins" strategy.
- **FR-013**: System MUST allow users to voluntarily leave their current workspace at any time.
- **FR-014**: Workspace sharing and participant management options MUST be located in a "User Settings" page, accessible via the profile submenu.

### Key Entities *(include if feature involves data)*

- **Workspace**: The primary container for financial data. Owned by members collectively. Key attributes: Name (derived from creator).
- **Invite**: A transient entity representing a pending membership offer. Contains a token, workspace ID, creator ID, and expiration.
- **User**: Represents an individual. Now belongs to exactly one Workspace.
- **FixedCost**: Financial records, now strictly owned by a Workspace instead of a User.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of invite links expire exactly 24 hours after generation.
- **SC-002**: 100% of users with existing data receive the "Destructive Join" warning before their data is purged.
- **SC-003**: Access revocation takes effect in less than 1 second across the API.
- **SC-004**: Workspace members can successfully invite new members and those members can join in under 3 minutes (excluding sign-in time).