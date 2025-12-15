# Quickstart: Main Forecast Chart Enhancement

**Date**: 2025-12-14
**Feature**: 004-forecast-chart-visual

## Prerequisites

- Node.js and pnpm installed
- Frontend dev server runs: `pnpm dev`
- Tests run: `pnpm test`

## Quick Implementation Overview

### 1. Files to Modify

```
frontend/src/components/dashboard/ForecastChart.vue  # Main implementation
frontend/tests/unit/components/dashboard/ForecastChart.spec.js  # Tests
```

### 2. Key Implementation Steps

#### Step 1: Add Chart Colors Constant

```javascript
const CHART_COLORS = {
  positive: '#4ADE80',
  negative: '#F87171',
  neutral: '#9CA3AF',
  zeroLine: 'rgba(255, 255, 255, 0.2)',
  text: '#FFFFFF'
};
```

#### Step 2: Create Gradient Helper

```javascript
function createGradient(ctx, chartArea, color, isPositive) {
  const gradient = ctx.createLinearGradient(
    0,
    isPositive ? chartArea.top : chartArea.bottom,
    0,
    chartArea.bottom // Fades to zero line area
  );
  gradient.addColorStop(0, color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  return gradient;
}
```

#### Step 3: Configure Dataset with Segment Styling

```javascript
const dataset = {
  data: dataPoints,
  borderWidth: 3,
  pointRadius: 4,
  tension: 0.3,
  segment: {
    borderColor: ctx => ctx.p1.parsed.y >= 0 ? CHART_COLORS.positive : CHART_COLORS.negative
  },
  fill: {
    target: 'origin',
    above: CHART_COLORS.positive,  // Or gradient
    below: CHART_COLORS.negative   // Or gradient
  }
};
```

#### Step 4: Configure Zero Line

```javascript
scales: {
  y: {
    grid: {
      color: ctx => ctx.tick.value === 0 ? CHART_COLORS.zeroLine : 'transparent',
      lineWidth: ctx => ctx.tick.value === 0 ? 1 : 0,
      borderDash: ctx => ctx.tick.value === 0 ? [5, 5] : []
    }
  },
  x: {
    grid: { display: false }
  }
}
```

### 3. Run Tests

```bash
cd frontend
pnpm test:coverage
```

Target: 60% coverage minimum

### 4. Visual Verification

1. Start dev server: `pnpm dev`
2. Navigate to dashboard
3. Verify:
   - Positive values show mint green line and fill
   - Negative values show coral line and fill
   - Gradient fades toward zero
   - Dashed zero line visible
   - No grid lines (clean appearance)
   - Thick line (~3px)
   - Visible data point dots

## Common Issues

### Gradient Not Appearing
- Ensure Filler plugin is registered
- Check `fill.target: 'origin'` is set
- Verify chartArea is available (may need `beforeDraw` hook)

### Colors Not Changing Per Segment
- Verify `segment.borderColor` is a function, not a value
- Check ctx.p1.parsed.y is being read correctly

### Zero Line Not Showing
- Ensure y-axis includes zero in its range
- Check grid.color callback returns visible color for value === 0

## Test Data Scenarios

```javascript
// All positive
const allPositive = [100, 200, 150, 300];

// All negative
const allNegative = [-100, -200, -150, -300];

// Crossing zero
const crossing = [100, 50, -50, -100, 50, 100];

// Single point at zero
const atZero = [100, 0, 100];
```
