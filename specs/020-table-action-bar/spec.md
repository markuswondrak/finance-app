# Feature Specification: Redesign table interface with Action Bar

**Feature Branch**: `020-table-action-bar`  
**Created**: 2025-12-26  
**Status**: Draft  
**Input**: User description: "Redesign the table interface (fixed and specialcost) by introducing a dedicated 'Action Bar' positioned between the tabs and the table headers. This bar should consolidate all management tools to separate actions from data. Please include: 1. **Search:** A text input field to quickly locate specific costs. 2. **Filter:** A dropdown for 'Gültig in Jahr' (Valid in Year) to easily view current vs. historical data. 3. **Primary Action:** A prominent 'Add New Cost' button positioned at the top right for immediate visibility. **Requirements:** * **Responsive Layout:** The bar must adapt fluidly to mobile screens (e.g., stacking elements or using icons) so functionality remains accessible on small devices. * **Cleanup:** Completely remove the old 'Add New' button from the bottom of the list to prevent redundancy."

## Clarifications

### Session 2025-12-26
- **Q: What is the default selection for the 'Valid in Year' dropdown on page load?** → **A: Starts empty (no filter), showing all data; includes a reset/clear option.**
- **Q: When a specific year is selected, which Fixed Costs should be displayed?** → **A: Any cost active during that year (overlap logic using precise Start/End Year-Month).**
- **Q: Should the search input also match against the Amount field?** → **A: No, Name and Description only.**
- **Q: Should the dropdown list individual months or just full years?** → **A: Use the `MonthYearDatepicker` component (selecting a specific Month and Year).**

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find Specific Cost (Priority: P1)

As a user, I want to quickly find a specific cost entry by typing its name or category so that I don't have to scroll through a long list.

**Why this priority**: Core usability improvement for managing large lists of costs.

**Independent Test**: Can be tested by entering text in the search field and verifying the table updates to show only matching rows.

**Acceptance Scenarios**:

1. **Given** a list of fixed or special costs, **When** I type "Insurance" into the search bar, **Then** the table should only display rows containing "Insurance".
2. **Given** a filtered list, **When** I clear the search input, **Then** the table should show all costs again (respecting other active filters).

---

### User Story 2 - Filter Costs by Year (Priority: P1)

As a user, I want to filter the costs to see only those valid in a specific year so that I can focus on current expenses or review historical data.

**Why this priority**: Essential for analyzing financial data across different time periods.

**Independent Test**: Can be tested by selecting different years from the dropdown and verifying the displayed costs match the selected year.

**Acceptance Scenarios**:

1. **Given** the cost table, **When** I select "2024" from the "Valid in Year" dropdown, **Then** only costs valid in 2024 should be visible.
2. **Given** the year filter, **When** I switch between years, **Then** the table content should update immediately without a page reload.

---

### User Story 3 - Add New Cost (Priority: P1)

As a user, I want a prominent button to add a new cost at the top of the table so that I can easily find it without scrolling to the bottom.

**Why this priority**: High-frequency action that needs to be easily accessible.

**Independent Test**: Can be tested by clicking the "Add New Cost" button and verifying the create cost form/modal appears.

**Acceptance Scenarios**:

1. **Given** the Action Bar, **When** I click the "Add New Cost" button, **Then** the "Add Cost" modal/form should open.
2. **Given** the cost list, **When** I look at the bottom of the list, **Then** the old "Add New" button should NOT be present.

---

### User Story 4 - Mobile Access (Priority: P2)

As a mobile user, I want the Action Bar to adapt to my small screen so that I can still search, filter, and add costs without layout issues.

**Why this priority**: Ensures the application is usable on all devices.

**Independent Test**: Can be tested by resizing the browser window to mobile width (e.g., 375px) and verifying layout adaptation.

**Acceptance Scenarios**:

1. **Given** a mobile screen width, **When** viewing the Action Bar, **Then** the elements (Search, Filter, Button) should stack vertically or use compact icons to fit the screen.
2. **Given** a mobile screen, **When** I use the controls, **Then** they should remain touch-friendly and usable.

### Edge Cases

- What happens when the search yields no results? (Table should show a "No results found" message).
- What happens if the year filter selection has no data? (Table should be empty or show a placeholder).
- What happens when a user types special characters in search? (System should handle them gracefully, likely literal matching).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display an "Action Bar" positioned between the page tabs and the cost table headers on both Fixed Cost and Special Cost pages.
- **FR-002**: The Action Bar MUST include a text input field for searching costs.
  - The search MUST match against the **Name** and **Description** fields.
  - The search MUST NOT match against the **Amount** field.
- **FR-003**: The Action Bar MUST include a date selection component for filtering costs.
  - The component MUST be the existing **MonthYearDatepicker** (used in cost edit forms).
  - The filter MUST default to empty (no selection) on page load, displaying all records.
  - The filter MUST provide a clear/reset option to return to the "no filter" state.
  - **Logic**: 
    - For **Fixed Costs**: A cost is visible if its validity range overlaps with the selected Month/Year.
    - For **Special Costs**: A cost is visible if its due date matches the selected Month/Year.
- **FR-004**: The Action Bar MUST include a primary "Add New Cost" button aligned to the right (on desktop).
- **FR-005**: The "Add New Cost" button MUST trigger the existing cost creation workflow (modal or navigation).
- **FR-006**: The system MUST filter the table rows in real-time (or near real-time) based on the Search input and Year filter.
- **FR-007**: The system MUST remove the legacy "Add New" button previously located at the bottom of the cost list.
- **FR-008**: On mobile devices (viewport width < 600px), the Action Bar MUST stack elements vertically or use a compact layout to ensure all controls are visible and accessible.

### Key Entities *(include if feature involves data)*

- **Cost Item**: Represents a Fixed or Special Cost, containing attributes like Name, Amount, Interval, and Validity Year.
- **Filter State**: Represents the current combination of Search Text and Selected Year applied to the view.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can filter the list to a specific year with 2 clicks or fewer.
- **SC-002**: Searching for a known cost displays the result in under 200ms (perceived instant).
- **SC-003**: The "Add New Cost" action is visible on the initial screen load without scrolling on 100% of standard desktop resolutions (1024x768 and above).
- **SC-004**: On mobile devices, all three controls (Search, Filter, Add) are accessible without horizontal scrolling.