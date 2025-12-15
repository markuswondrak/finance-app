# Data Model: Main Forecast Chart Enhancement

**Date**: 2025-12-14
**Feature**: 004-forecast-chart-visual

## Overview

This feature is a frontend-only visualization enhancement. It does not introduce new data entities but defines the chart configuration structure for the enhanced ForecastChart component.

## Chart Configuration Entity

### ChartColors

Defines the color palette for positive/negative value visualization.

```typescript
interface ChartColors {
  positive: string;       // '#4ADE80' - Mint green for values > 0
  negative: string;       // '#F87171' - Soft coral for values < 0
  neutral: string;        // '#9CA3AF' - Gray for zero values
  zeroLine: string;       // 'rgba(255, 255, 255, 0.2)' - Subtle dashed line
  text: string;           // '#FFFFFF' - Axis label color
}
```

### GradientConfig

Configuration for gradient fill creation.

```typescript
interface GradientConfig {
  startOpacity: number;   // 0.6 - Opacity at the data line
  endOpacity: number;     // 0.0 - Opacity at zero line (transparent)
  color: string;          // Base color (positive or negative)
}
```

### EnhancedChartOptions

Extended Chart.js options for the forecast chart.

```typescript
interface EnhancedChartOptions {
  // Line styling
  lineThickness: number;        // 3 (pixels) - Substantial line width
  pointRadius: number;          // 4 (pixels) - Data point marker size
  pointHoverRadius: number;     // 6 (pixels) - Hover state size

  // Grid configuration
  showGridLines: boolean;       // false - Minimize visual noise
  showZeroLine: boolean;        // true - Accessibility reference
  zeroLineStyle: 'dashed' | 'solid';  // 'dashed'

  // Fill configuration
  fillEnabled: boolean;         // true - Enable gradient fill
  fillTarget: 'origin';         // Fill to zero line
}
```

### ForecastDataPoint (existing)

No changes to existing data structure. Visualization reads existing format:

```typescript
interface ForecastDataPoint {
  yearMonth: string;      // 'YYYY-MM' format
  currentAmount: number;  // Can be positive, negative, or zero
}
```

## Chart.js Dataset Configuration

### Enhanced Dataset Structure

```typescript
interface EnhancedDataset {
  label: string;
  data: number[];

  // Line styling
  borderWidth: 3;
  borderColor: ScriptableFunction | string;  // Dynamic per segment
  tension: 0.3;                              // Smooth curve

  // Point styling
  pointRadius: 4;
  pointHoverRadius: 6;
  pointBackgroundColor: ScriptableFunction | string;
  pointBorderColor: ScriptableFunction | string;

  // Segment styling (for positive/negative coloring)
  segment: {
    borderColor: (ctx: SegmentContext) => string;
  };

  // Fill configuration
  fill: {
    target: 'origin';
    above: CanvasGradient | string;  // Positive gradient
    below: CanvasGradient | string;  // Negative gradient
  };
}
```

### SegmentContext

Context object provided by Chart.js for segment styling.

```typescript
interface SegmentContext {
  p0: {
    parsed: { x: number; y: number };
    skip: boolean;
  };
  p1: {
    parsed: { x: number; y: number };
    skip: boolean;
  };
  chart: ChartInstance;
}
```

## Scale Configuration

### Y-Axis with Zero Line

```typescript
interface YScaleConfig {
  grid: {
    display: boolean;                    // false for minimal grid
    color: (ctx: GridContext) => string; // Highlight zero line only
    lineWidth: (ctx: GridContext) => number;
    borderDash: (ctx: GridContext) => number[];
  };
  ticks: {
    color: string;                       // '#FFFFFF'
    callback: (value: number) => string; // Currency formatting
  };
}
```

### GridContext

Context for conditional grid line styling.

```typescript
interface GridContext {
  tick: {
    value: number;
  };
}
```

## State Transitions

This feature has no state transitions - it's a pure visualization configuration.

## Validation Rules

| Field | Rule | Rationale |
|-------|------|-----------|
| lineThickness | 1-5 pixels | Usability - too thin is hard to see, too thick obscures data |
| pointRadius | 2-8 pixels | Balance between visibility and not obscuring the line |
| startOpacity | 0.3-0.8 | Gradient must be visible but not overwhelming |
| colors | Valid hex/rgba | Required for Canvas rendering |

## Relationships

```
ForecastChart.vue
    │
    ├── receives: ForecastDataPoint[]
    │
    ├── uses: ChartColors (from theme/constants)
    │
    ├── creates: EnhancedDataset
    │   ├── segment colors (based on data values)
    │   └── gradient fills (created per render)
    │
    └── configures: Chart.js scales
        └── zero line styling
```

## Integration Points

1. **Props Interface**: ForecastChart receives `data` prop with forecast entries
2. **Theme Colors**: Uses existing `CHART_COLORS` from OverviewChart.vue pattern
3. **Utility Functions**: Uses existing `toCurrency`, `displayMonth` from Utils.js
4. **Filler Plugin**: Already registered in existing chart components
