
### Context: Design & Functionality Overhaul for Vue/Vuetify Finance App

**Project Overview**
The application is a financial forecasting tool built with **Vue**, **Vuetify**, and **FontAwesome**. Unlike a standard banking app that tracks past transactions, this app projects future balances based on:
1.  **Fixed Costs:** Structured as Monthly, Quarterly, and Yearly expenses.
2.  **Special Costs (Sonderkosten):** One-time future expenses (e.g., new kitchen, car).
3.  **Income:** Regular monthly inflow.
4.  **Current Balance:** The starting point for the calculation.

**Goal:** Transform the UI from a "flat utility" into a **modern, engaging Fintech Dashboard** that emphasizes visual hierarchy and forecasting clarity.

---

### I. Global Visual Language ("Fintech Dark Mode")
* **Theme:** Deep dark background (`#121212` or `grey darken-4`) with high-contrast elements.
* **Color Palette:**
    * **Background:** Dark Gray/Black.
    * **Primary Accent:** Mint Green (for positive financial trends).
    * **Alert Color:** Soft Red/Coral (for negative trends or debts).
    * **Surface/Cards:** Slightly lighter gray (`#1E1E1E`) to create depth against the background.
* **Shape & Depth:**
    * **Corners:** Aggressive rounding (`rounded-xl` or `rounded-lg`) on all cards and containers to feel friendly and modern.
    * **Elevation:** High elevation (shadows) on main cards to separate them from the background.
    * **Typography:** Bold, large headers (`text-h4`, `font-weight-bold`) for key numbers; lighter, smaller text for labels (`text-overline`, `grey--text`).

---

### II. Layout Structure
The page is divided into a sidebar navigation and a main content area.
* **Sidebar (Left):**
    * **Branding:** Add an App Icon/Logo at the top.
    * **Navigation:** Highlight the *Active Page* with a pill-shaped background or accent color.
    * **Grouping:** Visually separate the "Sonstiges" (Misc) section using a `subheader` style (uppercase, small, muted text) rather than a floating list item.
* **Main Content (Right):**
    * **Top Section (The Hero):** A large, full-width Chart Card showing the balance forecast over time.
    * **Bottom Section (The KPIs):** A row of 3 "Highlight Cards" displayed *below* the chart.

---

### III. Component Specifications

#### 1. The Main Forecast Chart (Top)
The chart serves as the visual anchor.
* **Fill:** Apply a **Gradient Fill** under the line (fading from the line color to transparent at the bottom) to anchor the data. Use the positive color palette for above zero and the negative color palette for below zero.
* **Grid:** Minimize or remove grid lines to reduce visual noise.
* **Data Points:** Use standard dots, but ensure the line thickness is substantial (approx `3px`).

#### 2. The Highlight Cards (Bottom)
Three cards arranged in a row (using `v-row` and `v-col`) beneath the chart. All cards share the `rounded-xl` styling.

* **Card 1: Current Balance (Input & Anchor)**
    * **Purpose:** Displays the starting capital. Acts as the primary input control.
    * **Visuals:** Displays the balance (e.g., "3.150 €") in large bold text.
    * **Interactivity:** **Click-to-Edit Pattern**.
        * The card has a visible "Edit/Pencil" icon.
        * **Action:** Clicking anywhere on the card opens a `v-dialog` modal.
        * **Modal Content:** A simple input field (`v-text-field`) to update the "Current Balance" variable. Upon saving, the entire forecast graph recalculates.

* **Card 2: Real Monthly Surplus (Budget Metric)**
    * **Purpose:** Shows "Safe-to-Spend" money.
    * **Logic:** (Monthly Income) - (Monthly Fixed + [Quarterly Fixed / 3] + [Yearly Fixed / 12]).
    * **Visuals:** Large value (e.g., "+ 450 €"). Includes a `v-sparkline` (mini-chart) inside the card to show the surplus trend over the last 6 months.
    * **Context:** Helps the user understand their *true* disposable income after accounting for hidden annual costs.

* **Card 3: Lowest Projected Point (Risk Metric)**
    * **Purpose:** Warns the user of future liquidity crunches.
    * **Logic:** Scans the calculated forecast array for the next 12 months and finds the minimum value.
    * **Visuals:**
        * If value > 0: Green/Neutral color.
        * If value < 0: Red/Warning color with an alert icon (`mdi-alert-circle`).
    * **Context:** Answers the question, "Will I go broke when I buy that kitchen in August?"

---

### IV. Summary of User Flow
1.  User enters the app and sees the **Forecast Chart** (Top) clearly visualizing their future wealth.
2.  User glances at **Card 3 (Lowest Point)** to ensure they stay in the green.
3.  User checks **Card 2 (Surplus)** to see how much "fun money" they have this month.
4.  User realizes their bank account balance has changed, so they click **Card 1 (Current Balance)**, enter the new number in the popup, and the chart/forecast instantly updates.