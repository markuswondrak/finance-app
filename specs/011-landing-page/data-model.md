# Data Model: Landing Page

**Feature**: `011-landing-page`

## Visual Entities (Component Props)

Since this feature is primarily frontend UI with mock data, the "data model" represents the structure of the props passed to the display components.

### 1. FeatureCard (Props)
Used in `FeatureGrid.vue`.

| Field | Type | Description |
|-------|------|-------------|
| `title` | `String` | The headline of the feature (e.g., "Smart Forecasting"). |
| `description` | `String` | The body text explaining the feature. |
| `icon` | `String` | The icon name (e.g., `fa-chart-line`). |
| `delay` | `Number` | Animation delay in ms (staggered entrance). |

### 2. MockForecastData (Internal Constant)
Used in `HeroSection.vue` to drive the chart.

```json
{
  "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  "datasets": [
    {
      "label": "Projected Balance",
      "data": [1200, 1500, 1100, 1800, 2200, 2500],
      "borderColor": "#2ecc71",
      "backgroundColor": "rgba(46, 204, 113, 0.1)"
    }
  ]
}
```

### 3. MockLowestBalanceData (Internal Constant)
Used in `InteractivePreview.vue`.

```json
{
  "value": 450,
  "date": "2025-03-15",
  "trend": "stable" // or 'down', 'up'
}
```

## State Management

- **Auth State**: Read-only access to checking if user is authenticated (via `localStorage` token or Store).
- **Navigation State**: None (stateless page).
