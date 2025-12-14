# Feature Specification: Dashboard Layout Structure

**Feature Branch**: `003-dashboard-layout`
**Created**: 2025-12-13
**Status**: Draft
**Input**: Restructure the main content area with a top section (Hero) containing a large full-width chart card showing the balance forecast over time, and a bottom section (KPIs) with a row of 3 highlight cards displayed below the chart. The layout should emphasize the forecast chart as the visual anchor while keeping key metrics easily accessible.
**Update (2025-12-14)**: The navigation toggle should hover over the main content (overlay) to maximize screen space on both wide and mobile screens.

## Clarifications

### Session 2025-12-14

- Q: Height strategy for Hero chart? → A: Fixed Aspect Ratio (e.g., 21:9) to ensure predictable scaling.
- Q: KPI card layout on tablet? → A: Maintain 3-column row (scale down width) to prevent scrolling.
- Q: Hero chart loading state? → A: Skeleton container with fixed aspect ratio to prevent layout shift.
- Q: Gutter spacing strategy? → A: Pixel-based value (e.g., 24px) with responsive adjustments.
- Q: KPI card content overflow? → A: Dynamically adjust font size to fit content within card width.
### Session 2025-12-14

- Q: Floating toggle visual interaction? → A: Semi-transparent background with blur (glassmorphism) for legibility.
- Q: Toggle default position? → A: Bottom-left on wide screens, top-left on mobile screens.
- Q: Menu appearance behavior? → A: Slide-in overlay on mobile, pushes content (adjusting layout) on wide screens.
- Q: Wide screen toggle overlap? → A: Ignore; users can scroll or work around.
- Q: Toggle accessibility? → A: Full ARIA compliance, keyboard navigation, and sufficient contrast.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hero Forecast Chart as Visual Anchor (Priority: P1)

As a user opening the dashboard, I want to immediately see a large, prominent forecast chart so that I can quickly understand my projected financial trajectory at a glance.

**Why this priority**: The forecast chart is the primary value proposition of the application. Users should see their financial future immediately upon entering the dashboard.

**Independent Test**: Can be fully tested by opening the dashboard and verifying the chart occupies the full width of the main content area and is positioned prominently at the top.

**Acceptance Scenarios**:

1. **Given** I navigate to the dashboard, **When** the page loads, **Then** a large forecast chart is displayed spanning the full width of the main content area
2. **Given** I am viewing the dashboard, **When** I look at the top section, **Then** the forecast chart is the most visually prominent element
3. **Given** the dashboard contains other content, **When** I scan the page, **Then** my eye is naturally drawn to the forecast chart first

---

### User Story 2 - KPI Cards Row Below Chart (Priority: P2)

As a user who has viewed the forecast chart, I want to see key financial metrics displayed in a row of cards below the chart so that I can quickly access important summary information without scrolling or searching.

**Why this priority**: KPI cards provide essential context and actionable insights that complement the forecast chart. They need to be visible but secondary to the main visualization.

**Independent Test**: Can be fully tested by viewing the dashboard and verifying 3 cards are displayed in a horizontal row below the chart.

**Acceptance Scenarios**:

1. **Given** I am viewing the dashboard, **When** I look below the forecast chart, **Then** I see exactly 3 highlight cards arranged in a horizontal row
2. **Given** the 3 KPI cards are displayed, **When** I view them on a standard desktop screen, **Then** all 3 cards are visible without horizontal scrolling
3. **Given** the dashboard is loaded, **When** I scan from top to bottom, **Then** I see the chart first, then the row of cards beneath it

---

### User Story 3 - Responsive Layout Adaptation (Priority: P3)

As a user accessing the dashboard on different devices, I want the layout to adapt appropriately so that I can view both the chart and KPI cards effectively regardless of screen size.

**Why this priority**: Responsive design ensures usability across devices. While important, the core desktop layout experience takes precedence.

**Independent Test**: Can be fully tested by resizing the browser window and verifying the layout adapts while maintaining visibility of key elements.

**Acceptance Scenarios**:

1. **Given** I am viewing the dashboard on a tablet, **When** the screen width is reduced, **Then** the KPI cards remain in a 3-column row with scaled-down widths
2. **Given** I am viewing the dashboard on mobile, **When** the layout adapts, **Then** the forecast chart remains full-width and cards stack vertically below it
3. **Given** any screen size, **When** I view the dashboard, **Then** no content is cut off or requires horizontal scrolling

---

### User Story 4 - Floating Navigation Toggle (Priority: P2)

As a user, I want the navigation toggle to float above the content so that I can maximize the available screen space for the dashboard charts and metrics.

**Why this priority**: Maximizing data visibility is critical for financial dashboards. Fixed headers or bars dedicated solely to a toggle button waste valuable screen real estate.

**Independent Test**: Can be fully tested by viewing the dashboard and verifying the toggle button overlaps the content (z-index) and doesn't push content down or sideways.

**Acceptance Scenarios**:

1. **Given** I am viewing the dashboard, **When** I look at the navigation toggle, **Then** it is positioned over the main content (overlay) without displacing it
2. **Given** I am on a mobile device, **When** I view the toggle, **Then** it floats over the content
3. **Given** I am on a desktop device, **When** I view the toggle, **Then** it floats over the content

### Edge Cases

- What happens when the browser window is very narrow? Cards should stack vertically; chart should scale down while maintaining readability
- What happens when data for a KPI card is loading? Display loading state placeholder in card position
- What happens when there are fewer than 3 KPI metrics available? Display available cards; empty slots may be hidden or show placeholder
- What happens if the floating toggle covers important data? Ensure toggle position (e.g., top-left) avoids critical chart areas or KPI values

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Dashboard MUST display a Hero section at the top containing the forecast chart
- **FR-002**: Forecast chart MUST span the full width of the main content area and maintain a fixed 21:9 aspect ratio
- **FR-003**: Dashboard MUST display a KPI section below the Hero section
- **FR-004**: KPI section MUST contain exactly 3 highlight cards arranged in a row
- **FR-005**: On desktop screens, all 3 KPI cards MUST be visible without scrolling
- **FR-006**: Layout MUST be responsive: maintain 3-column row on tablet, stack vertically on mobile
- **FR-007**: Forecast chart MUST be visually prominent (larger size, higher position) relative to KPI cards
- **FR-008**: KPI cards MUST have equal width distribution within the row
- **FR-009**: Layout MUST maintain consistent spacing between Hero/KPI sections and between KPI cards: 24px on desktop/tablet, 16px on mobile
- **FR-010**: Hero section loading state MUST use a skeleton placeholder that occupies the full fixed aspect ratio area to prevent layout shift
- **FR-011**: Text content within KPI cards MUST dynamically adjust its font size to fit within the card's width without truncation or wrapping
- **FR-012**: Navigation toggle button MUST act as a floating overlay element above the main content area
- **FR-013**: Floating navigation toggle MUST be consistent across all screen sizes (desktop and mobile)
- **FR-014**: Navigation toggle/menu MUST overlay content on mobile without shifting layout; on wide screens, expanding the menu MUST push/resize main content
- **FR-015**: Floating navigation toggle MUST use a semi-transparent background with a blur effect (glassmorphism) to ensure legibility against varied background content.
- **FR-016**: Navigation toggle MUST be positioned at the bottom-left on wide screens and top-left on mobile screens.
- **FR-017**: Navigation menu MUST appear as a slide-in overlay on mobile devices and a persistent side panel that pushes content on wide screens.
- **FR-018**: Floating navigation toggle MUST adhere to full ARIA compliance, support keyboard navigation, and maintain sufficient contrast for accessibility.

### Key Entities

- **Hero Section**: The top portion of the dashboard dedicated to the primary forecast visualization
- **KPI Section**: The bottom portion containing summary metric cards
- **KPI Card**: A container displaying a single key performance indicator with its value and context

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users identify the forecast chart as the primary dashboard element within 2 seconds of page load
- **SC-002**: All 3 KPI cards are visible above the fold on standard desktop screens (1920x1080)
- **SC-003**: Dashboard layout renders correctly on 95% of common screen sizes (verified through responsive testing)
- **SC-004**: Users can locate all key metrics (chart + 3 KPIs) without scrolling on desktop
- **SC-005**: Page layout shift (visual instability during load) is minimized to provide smooth experience

## Assumptions

- The dashboard is a single-page view (not tabbed or multi-section)
- KPI cards will display content defined in separate features (Current Balance, Monthly Surplus, Lowest Projected Point)
- The forecast chart content and interactivity are defined in a separate feature
- Standard breakpoints for responsive design: desktop (>1024px), tablet (768-1024px), mobile (<768px)
- Navigation toggle overlays content; drawer overlays on mobile, pushes content on desktop (per Constitution VII)
