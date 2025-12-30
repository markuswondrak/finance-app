# Feature Specification: Save-To-Spend Calculator (Monatsspielraum)

**Feature Branch**: `022-save-to-spend`
**Created**: 2025-12-29
**Status**: Draft
**GitHub Issue**: #8

## Overview

A standard bank balance is often misleading. It shows the money currently in the account, but fails to account for pending fixed costs (like rent or subscriptions) that haven't been debited yet. This leads to users accidentally overspending and facing liquidity issues at the end of the month.

"Monatsspielraum" (Monthly Leeway) is a dynamic "Safe-to-Spend" calculator that provides clarity by bridging the gap between the current account balance and the actual disposable income.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Safe-to-Spend Amount (Priority: P1)

As a user, I want to see my true disposable income at a glance so that I know exactly how much money I can safely spend without risking overdraft or missing bill payments.

**Why this priority**: This is the core value proposition of the feature. Without displaying the calculated safe-to-spend amount, the feature has no purpose. This must work first.

**Independent Test**: Can be fully tested by entering a bank balance, having some fixed costs marked as pending, and verifying the safe-to-spend amount equals (balance - sum of pending costs).

**Acceptance Scenarios**:

1. **Given** a user has a bank balance of €2,000 and pending relevant fixed costs totaling €800, **When** they view the Safe-to-Spend screen, **Then** they see €1,200 as their available spending money.
2. **Given** a user has a bank balance of €500 and pending relevant fixed costs totaling €700, **When** they view the Safe-to-Spend screen, **Then** they see -€200 (negative) with a warning indicator.
3. **Given** a user has no pending relevant fixed costs, **When** they view the Safe-to-Spend screen, **Then** the safe-to-spend amount equals their full bank balance.

---

### User Story 2 - Enter Current Bank Balance (Priority: P2)

As a user, I want to enter or update my current bank balance so that the safe-to-spend calculation reflects my actual financial situation.

**Why this priority**: The calculation depends on knowing the current balance. This is a prerequisite for accurate results but secondary to the display logic.

**Independent Test**: Can be fully tested by entering a balance amount and verifying it persists and displays correctly.

**Acceptance Scenarios**:

1. **Given** a user is on the Safe-to-Spend screen, **When** they enter a balance of €1,500, **Then** the system saves and displays €1,500 as the current balance.
2. **Given** a user has previously entered €1,000, **When** they update it to €1,200, **Then** the safe-to-spend amount recalculates immediately.
3. **Given** a user enters an invalid value (negative or non-numeric), **When** they try to save, **Then** the system shows a validation error and does not save.

---

### User Story 3 - Manage Fixed Costs Payment Status (Priority: P3)

As a user, I want to mark my recurring fixed costs as "paid" or "pending" for the current month so that only unpaid costs are deducted from my available balance.

**Why this priority**: This enables the dynamic aspect of the calculator. Users need control over which costs are still pending to get accurate results.

**Independent Test**: Can be fully tested by toggling a fixed cost between paid/pending and verifying the safe-to-spend amount updates accordingly.

**Acceptance Scenarios**:

1. **Given** a user has a fixed cost of €100 marked as pending, **When** they mark it as paid, **Then** the safe-to-spend amount increases by €100.
2. **Given** a user has a fixed cost of €200 marked as paid, **When** they mark it as pending, **Then** the safe-to-spend amount decreases by €200.
3. **Given** a user views the fixed costs list, **When** the list loads, **Then** each cost shows its name, amount, and current status (paid/pending checkbox).

---

### User Story 4 - View Fixed Costs Checklist (Priority: P4)

As a user, I want to see all my recurring fixed costs for the current month in a checklist format so that I can review and manage what's been paid.

**Why this priority**: Provides visibility into what costs are being considered. Enhances user understanding and trust in the calculation.

**Independent Test**: Can be fully tested by viewing the checklist and verifying all fixed costs from the user's profile are displayed with correct amounts.

**Acceptance Scenarios**:

1. **Given** a user has 5 fixed costs configured, **When** they view the checklist, **Then** all 5 costs are displayed with name and amount.
2. **Given** a user has no fixed costs configured, **When** they view the checklist, **Then** they see an empty state with guidance to add fixed costs.

---

### User Story 5 - Select Fixed Costs Relevant for Save-to-Spend (Priority: P2)

As a user, I want to select which fixed costs should be included in the save-to-spend calculation so that only costs with predictable single-payment deductions are considered, while budget-style costs (like groceries) that I spend incrementally throughout the month are excluded.

**Why this priority**: Not all fixed costs behave the same way. Rent is a single monthly debit, but a grocery budget of €400 might be spent €50 at a time throughout the month. Including the full grocery budget would overstate pending costs and understate available spending money. This is critical for calculation accuracy.

**Independent Test**: Can be fully tested by toggling a fixed cost's "include in save-to-spend" setting and verifying the calculation updates accordingly.

**Acceptance Scenarios**:

1. **Given** a user has a fixed cost "Rent €800" marked as relevant for save-to-spend and pending, **When** they view the Safe-to-Spend screen, **Then** €800 is deducted from their balance.
2. **Given** a user has a fixed cost "Groceries €400" marked as NOT relevant for save-to-spend, **When** they view the Safe-to-Spend screen, **Then** the grocery budget is NOT deducted regardless of its paid/pending status.
3. **Given** a user views the Save-to-Spend page checklist, **When** they toggle "Include in Save-to-Spend" off for a cost, **Then** the safe-to-spend amount increases by that cost's amount (if it was pending).
4. **Given** a user has 5 fixed costs with only 3 marked as relevant, **When** the checklist loads, **Then** only those 3 relevant costs appear in the save-to-spend checklist.

---

### User Story 6 - Add One-Time Pending Costs (Priority: P3)

As a user, I want to add one-time pending costs (like credit card bills or large purchases not yet debited) to the save-to-spend calculation without adding them to my general fixed costs, so that I can account for irregular expenses that will reduce my available balance.

**Why this priority**: Credit card bills and other one-time costs are not fixed/recurring but still affect available balance. Users need a way to track these pending deductions without polluting their fixed costs list. This completes the picture of "what's about to leave my account."

**Independent Test**: Can be fully tested by adding a one-time cost and verifying it appears in the checklist and reduces the safe-to-spend amount.

**Acceptance Scenarios**:

1. **Given** a user has a bank balance of €2,000 and no pending costs, **When** they add a one-time cost "Credit Card €350", **Then** the safe-to-spend decreases to €1,650.
2. **Given** a user has added a one-time cost "Credit Card €350", **When** they mark it as paid, **Then** the cost is removed from the checklist and safe-to-spend increases by €350.
3. **Given** a user has added a one-time cost by mistake, **When** they delete it, **Then** the cost is removed entirely and safe-to-spend recalculates.
4. **Given** a user views the save-to-spend checklist, **When** the list loads, **Then** one-time costs are displayed alongside fixed costs but visually distinguished (e.g., different icon or label).
5. **Given** a user adds a one-time cost for this month, **When** they view the workspace fixed costs page, **Then** the one-time cost does NOT appear there (it's scoped only to save-to-spend).
6. **Given** a new month begins, **When** the user views save-to-spend, **Then** unpaid one-time costs from the previous month are automatically removed (they don't carry over).

---

### Edge Cases

- What happens when the user has no fixed costs configured? → Show full balance as safe-to-spend with a note that no deductions apply.
- What happens when pending costs exceed the current balance? → Display a negative safe-to-spend amount with a visual warning (red color, alert icon).
- How does the system handle the start of a new month? → All fixed costs reset to "pending" status at the beginning of each month.
- What happens if the user hasn't entered a bank balance? → Prompt user to enter their balance before showing calculations.
- How are fixed costs with different billing cycles handled? → For MVP, assume all fixed costs are monthly. Future enhancement can support different frequencies.
- How are budget-style costs (e.g., groceries) handled? → Users can mark these as "not relevant" for save-to-spend since they are spent incrementally throughout the month rather than as a single debit. The default for new fixed costs is "relevant" (included).
- How are one-time costs like credit card bills handled? → Users can add these as "one-time pending costs" which are separate from fixed costs. They appear only in save-to-spend, don't pollute the workspace fixed costs, and are automatically cleared at month end.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST calculate safe-to-spend as (current balance - sum of pending relevant fixed costs - sum of unpaid one-time pending costs).
- **FR-002**: System MUST allow users to manually enter their current bank balance.
- **FR-003**: System MUST display a checklist of fixed costs that are marked as relevant for save-to-spend.
- **FR-004**: System MUST allow users to toggle each fixed cost between "paid" and "pending" status.
- **FR-005**: System MUST recalculate safe-to-spend immediately when balance, payment status, or relevance setting changes.
- **FR-006**: System MUST visually indicate when safe-to-spend is negative (warning state).
- **FR-007**: System MUST persist the payment status of fixed costs for the current month.
- **FR-008**: System MUST reset all fixed costs to "pending" status at the start of each new month.
- **FR-009**: System MUST display the safe-to-spend amount prominently on the screen.
- **FR-010**: System MUST show an empty state when no fixed costs are configured or marked as relevant.
- **FR-011**: System MUST allow users to mark each fixed cost as "relevant" or "not relevant" for save-to-spend calculation, via a toggle on the Save-to-Spend page.
- **FR-012**: System MUST persist the relevance setting per fixed cost (not reset monthly).
- **FR-013**: System MUST allow users to add one-time pending costs (name, amount) to the save-to-spend calculation.
- **FR-014**: System MUST include unpaid one-time pending costs in the safe-to-spend calculation.
- **FR-015**: System MUST allow users to mark one-time pending costs as paid, removing them from the calculation.
- **FR-020**: System MUST allow users to delete one-time pending costs entirely.
- **FR-016**: System MUST automatically remove one-time pending costs when a new month begins.
- **FR-017**: System MUST NOT add one-time pending costs to the workspace's general fixed costs list.
- **FR-018**: System MUST visually distinguish one-time costs from recurring fixed costs in the checklist.
- **FR-019**: System MUST provide a dedicated Save-to-Spend page accessible from the main navigation.

### Key Entities

- **BankBalance**: The user's current account balance. Attributes: amount (decimal), lastUpdated (timestamp), workspaceId (reference).
- **FixedCost**: A recurring expense that the user expects to pay. Attributes: name (string), amount (decimal), category (optional), isActive (boolean), **includeInSaveToSpend (boolean, default: true)**. Already exists in the system (new attribute to be added).
- **MonthlyPaymentStatus**: Tracks whether a fixed cost has been paid for a specific month. Attributes: fixedCostId (reference), month (YYYY-MM), isPaid (boolean), paidAt (timestamp, optional).
- **OneTimePendingCost**: A non-recurring expense added specifically to the save-to-spend calculation for the current month. Attributes: name (string), amount (decimal), month (YYYY-MM), isPaid (boolean), createdAt (timestamp), workspaceId (reference). Scoped only to save-to-spend feature, not part of general fixed costs. Automatically removed when a new month begins.
- **SafeToSpend**: Calculated value (not stored). Formula: BankBalance.amount - SUM(pending relevant fixed costs) - SUM(unpaid one-time pending costs). Expanded: BankBalance.amount - SUM(FixedCost.amount WHERE MonthlyPaymentStatus.isPaid = false AND FixedCost.includeInSaveToSpend = true) - SUM(OneTimePendingCost.amount WHERE isPaid = false AND month = currentMonth).

## Assumptions

- Users already have fixed costs configured in the system (existing functionality).
- All fixed costs are treated as monthly for this MVP.
- Bank balance is manually entered (no bank sync integration for MVP).
- The feature operates within the context of a single workspace.
- Currency is handled consistently with the existing system (Euro assumed based on issue context).
- All workspace members have equal access to view and modify Save-to-Spend data (bank balance, payment status, one-time costs).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view their safe-to-spend amount within 2 seconds of opening the screen.
- **SC-002**: Users can update their bank balance and see recalculated results within 1 second.
- **SC-003**: Users can mark a fixed cost as paid/pending with a single tap/click.
- **SC-004**: 90% of users understand the safe-to-spend concept without additional explanation (measured via user testing).
- **SC-005**: Users report increased confidence in their spending decisions (qualitative feedback).
- **SC-006**: Zero calculation errors when tested with various balance and fixed cost combinations.

## Out of Scope

- Automatic bank account synchronization (future enhancement)
- Support for non-monthly billing cycles (weekly, quarterly, annual)
- Historical tracking of safe-to-spend over time
- Notifications/alerts when safe-to-spend drops below threshold
- Multiple bank account aggregation

## Clarifications

### Session 2025-12-29

- Q: Should all fixed costs be included in the save-to-spend calculation? → A: No. Users must be able to select which fixed costs are relevant for save-to-spend. Budget-style costs like groceries (e.g., €400/month) are spent incrementally throughout the month rather than as a single debit, so including the full amount would overstate pending costs. Only costs with predictable single-payment deductions (rent, subscriptions, insurance) should be marked as relevant.
- Q: How should one-time costs like credit card bills be handled? → A: Users can add "one-time pending costs" that are scoped only to save-to-spend for the current month. These are NOT added to the workspace's general fixed costs. They appear in the save-to-spend checklist, reduce available balance when unpaid, and are automatically removed at month end. This allows tracking irregular expenses (credit card bills, large purchases pending debit) without polluting the recurring fixed costs configuration.
- Q: Where should the Save-to-Spend feature be accessed from? → A: New dedicated page in main navigation (alongside existing pages).
- Q: Where should users toggle the "Include in Save-to-Spend" setting? → A: On the Save-to-Spend page itself (in the checklist view), not on the Fixed Costs page.
- Q: Who can view and modify Save-to-Spend data within a workspace? → A: All workspace members can view and modify (shared data).
- Q: How should users remove a one-time pending cost? → A: Users can either "mark as paid" (removes from calculation) or "delete" (removes entirely). Both options available for flexibility.
