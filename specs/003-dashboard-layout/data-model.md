# Data Model: Dashboard Components

## 1. Component: ForecastChart

**Responsibility**: Renders the line chart with financial forecast.

**Props**:
- `loading` (Boolean): Triggers the skeleton loading state.
- `data` (Object): The chart data object (Chart.js format). If null/empty and not loading, shows "No data".

**Aspect Ratio**: 21:9 (Enforced by CSS container).

## 2. Component: KPICard

**Responsibility**: Displays a single metric.

**Props**:
- `title` (String): The label (e.g., "Current Balance").
- `value` (String/Number): The main metric value (e.g., "$5,000").
- `trend` (Object, optional):
  - `direction` ('up' | 'down' | 'flat')
  - `percentage` (Number)
  - `sparkline` (Array<Number>) - *Note: Sparkline is separate feature but we define prop slot*.
- `loading` (Boolean): Triggers loading placeholder.
- `variant` (String): 'default' | 'risk' | 'success' (mapped to colors).

## 3. Component: KPISection

**Responsibility**: Layout container for 3 cards.

**Props**:
- `metrics` (Array<KPICardProps>): List of 3 metric objects.
- `loading` (Boolean): Propagates to children.

**Constraints**:
- Always renders 3 slots (even if empty, placeholders used).
- Grid: `cols="12" sm="4"`.

## 4. Component: NavigationToggle (Layout)

**State**:
- `isOpen` (Boolean): V-Model for drawer.

**Visuals**:
- Position: Fixed (Bottom-Left on LG+, Top-Left on XS/SM/MD).
- Style: Glassmorphism.
