# Research: Dashboard Layout & Navigation

## 1. Navigation Toggle Implementation

**Requirement**: Floating toggle, bottom-left (desktop) / top-left (mobile). Drawer pushes content (desktop) / overlays (mobile).

**Analysis**:
- **Vuetify Drawer**:
  - Use `v-navigation-drawer` with `:temporary="mobile"` (mobile behavior) and `:permanent="!mobile"` (desktop behavior).
  - Note: "Pushes content" is default for permanent drawers in Vuetify `v-main`.
- **Toggle Button**:
  - Cannot be inside `v-app-bar` (as that would force a top bar layout).
  - Should be a `v-btn` with `icon` prop.
  - Positioning:
    - **Mobile**: `class="position-fixed top-0 left-0 ma-4 z-index-high"`
    - **Desktop**: `class="position-fixed bottom-0 left-0 ma-4 z-index-high"`
  - **Interaction**:
    - Clicking toggles the drawer state (`drawer = !drawer`).

**Decision**:
- Remove `v-app-bar` if strictly not needed, or keep it empty/transparent if required for other views (but spec implies dashboard focus). We will implement the toggle as a standalone `v-btn` in `Layout.vue`.
- Use Vuetify display helpers (`mobile`) to switch positioning classes dynamically.

## 2. Hero Chart Aspect Ratio

**Requirement**: Fixed 21:9 aspect ratio.

**Analysis**:
- **CSS**: `aspect-ratio` property is widely supported.
- **Implementation**:
  - Create a container `div` or `v-card` with style `aspect-ratio: 21/9; width: 100%;`.
  - Inside, place the `Line` chart (vue-chartjs) with `maintainAspectRatio: false` (so it fills the container).
  - For loading: Place `v-skeleton-loader` inside the same container with absolute positioning or just let the container maintain shape.

**Decision**:
- Use CSS `aspect-ratio: 21 / 9`.
- Configure Chart.js with `responsive: true, maintainAspectRatio: false`.

## 3. Glassmorphism

**Requirement**: Semi-transparent background with blur.

**Analysis**:
- **CSS**: `backdrop-filter: blur(10px)` is the standard.
- **Vuetify**: Create a custom class or utility.
  ```css
  .glass-button {
    background-color: rgba(var(--v-theme-surface-variant), 0.6) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  ```

**Decision**:
- Implement a scoped CSS class `.glass-button` in `Layout.vue` or a global utility.

## 4. KPI Grid Layout

**Requirement**: 3 columns (Desktop) / Stacked (Mobile) / 3 columns scaled (Tablet).

**Analysis**:
- **Desktop (>1280px)**: `v-col cols="4"` (3 cards in 12-col grid).
- **Tablet (960px - 1280px)**: The spec Clarification 2 says "Maintain 3-column row". So still `v-col cols="4"`.
- **Mobile (<600px)**: `v-col cols="12"`.
- **Intermediate**: Vuetify has `xs`, `sm`, `md`, `lg`, `xl`.
  - `lg` (Desktop): 4
  - `md` (Tablet): 4
  - `sm` (Small Tablet): 4 (Spec says "maintain 3-column", might be tight but required).
  - `xs` (Mobile): 12

**Decision**:
- `<v-row>`
- `<v-col cols="12" sm="4" md="4" lg="4">`
- This ensures stacking only happens on `xs` (extra small, <600px), maintaining 3-columns on `sm` (small tablet, >600px).
