# Feature Specification: Redesign Landing Page

**Feature Branch**: `019-landing-page-redesign`
**Created**: 2025-12-25
**Status**: Draft
**Input**: User description: "as a user the landingpage should be redesigned to represent the current status of the application. - The welath management should be included. - A small calculator gimmick should be presented, where the user can play around with different saving rates and returns - The page should be translated to german to match the language of the application - Only one login to google button - A made in EU statement is important Its important to have a modern, sleek and appealing to young people who are interested in their financial organization"

## Clarifications

### Session 2025-12-25
- Q: How should the calculator projection results be visualized? → A: Simple chart: Show a small growth curve over time in addition to the final value.
- Q: What is the default projection period for the savings calculator? → A: User-adjustable (fixed values: 15, 20, 25 years).
- Q: Where should the "Made in EU" statement be prominently displayed? → A: Hero section (prominent near the top).
- Q: How should the application behave if an already authenticated user visits the landing page? → A: Automatic redirect to Dashboard.
- Q: What content should be included in the landing page footer? → A: Legal links (Impressum, Datenschutz).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - German "Made in EU" Landing Page (Priority: P1)

As a potential user, I want to see a modern, German-language landing page that highlights the application's wealth management features and its "Made in EU" origin so that I feel trust and interest in the product.

**Why this priority**: Sets the first impression, establishes the correct language context, and communicates the core value proposition and trust markers.

**Independent Test**: Can be verified by loading the root URL and inspecting the text language, the presence of the "Made in EU" statement, and the Wealth Management section.

**Acceptance Scenarios**:

1. **Given** a user visits the root URL, **When** the page loads, **Then** all text content is in German.
2. **Given** the user views the landing page, **When** they look for product details, **Then** they see a dedicated section describing/illustrating the Wealth Management features.
3. **Given** the user views the page, **When** they inspect the footer or hero section, **Then** a "Made in EU" statement/badge is clearly visible.
4. **Given** the user visits the page on a mobile device, **When** the page renders, **Then** the layout is responsive and readable (modern/sleek).
5. **Given** the user visits the page on a small screen, **When** viewing the landing page, **Then** the global application header is not visible.

---

### User Story 2 - Google Login Entry (Priority: P1)

As a user, I want to log in using a single Google button so that my entry into the app is quick and simple.

**Why this priority**: This is the primary (and only) access point to the application.

**Independent Test**: Can be verified by checking the existence of the button and the absence of other login forms.

**Acceptance Scenarios**:

1. **Given** the user is on the landing page, **When** they look for login options, **Then** they see exactly one button labeled "Login with Google" (or German equivalent).
2. **Given** the user clicks the Google login button, **When** the action completes, **Then** the user is redirected to the Google authentication flow.

---

### User Story 3 - Savings Calculator Gimmick (Priority: P2)

As a user, I want to play with a savings calculator on the landing page so that I can visualize the potential impact of different saving rates and returns on my wealth.

**Why this priority**: Increases engagement and demonstrates the value of financial organization immediately.

**Independent Test**: Can be verified by entering values into inputs and observing the calculated result update.

**Acceptance Scenarios**:

1. **Given** the user is on the landing page, **When** they scroll to the calculator section, **Then** they see inputs for "Saving Rate" (e.g., monthly amount) and "Return" (interest rate).
2. **Given** the user enters a saving amount and return rate, **When** the inputs change, **Then** the calculator displays a projected future wealth value.
3. **Given** the user interacts with the calculator, **When** they try invalid inputs (e.g., negative numbers), **Then** the system handles them gracefully (e.g., clamps values or shows simple error).

### Edge Cases

- What happens when the user has JavaScript disabled? (Calculator may not work, but content should be readable).
- What happens when the user is already logged in? (System MUST automatically redirect to the dashboard).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The landing page MUST be served at the application root and replace any existing landing page.
- **FR-002**: All visible text content on the landing page MUST be in German.
- **FR-003**: The visual design MUST adhere to a "modern, sleek" aesthetic suitable for a young audience (ensuring responsive layout and consistent theming).
- **FR-004**: The page MUST include a section explicitly marketing the "Wealth Management" capabilities of the app.
- **FR-005**: The page MUST prominently display a "Made in EU" statement or badge in the hero section (near the top).
- **FR-006**: The page MUST provide a single call-to-action button for "Login with Google" and NO other login forms (username/password).
- **FR-007**: The page MUST include an interactive calculator component.
- **FR-008**: The calculator MUST accept inputs for a monetary saving amount, a percentage return rate, and a projection period (15, 20, or 25 years).
- **FR-009**: The calculator MUST calculate and display a result (e.g., accumulated wealth) and a visual growth curve chart based on the user's inputs.
- **FR-010**: The application header MUST NOT be visible on small screen views (mobile) when the landing page is active.
- **FR-011**: The page MUST include a footer with links to "Impressum" and "Datenschutz".

### Key Entities *(include if feature involves data)*

- **Calculator State**:
    - `monthlySavings`: Number (User input)
    - `returnRate`: Number (User input, percentage)
    - `projectionYears`: Number (User selectable: 15, 20, 25)
    - `projectedValue`: Number (Calculated output)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Landing page load time is under 1.5 seconds on 4G networks (visual performance).
- **SC-002**: 100% of user-facing text is in German.
- **SC-003**: The calculator updates the projected value and chart immediately (real-time or on blur) without page reload.
- **SC-004**: There is exactly 1 interactive login element on the page.

## Assumptions

- The "saving rate" refers to a monthly contribution amount.
- The "return" refers to an annual interest rate.
- The calculator uses a standard compound interest formula.
- "Made in EU" can be a text statement or a styled badge.