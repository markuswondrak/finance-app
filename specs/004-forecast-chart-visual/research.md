# Research: Main Forecast Chart Enhancement

**Date**: 2025-12-14
**Feature**: 004-forecast-chart-visual

## Research Questions

### 1. How to implement different colors for positive/negative values?

**Decision**: Use Chart.js `fill.above` and `fill.below` options combined with `segment` scriptable options

**Rationale**: Chart.js 4.x natively supports filling areas above and below a target (like origin) with different colors. The `fill` option accepts an object with `target: 'origin'`, `above`, and `below` properties. For line segment coloring, the `segment` option allows scriptable functions that receive context with `p0` and `p1` (the two points defining each segment) to dynamically set `borderColor`.

**Alternatives considered**:
- Custom plugin: More complex, unnecessary given native support
- Multiple datasets: Would complicate data management and tooltip handling
- Post-render canvas manipulation: Fragile, doesn't integrate with Chart.js lifecycle

**Source**: [Chart.js Area Chart Docs](https://www.chartjs.org/docs/latest/charts/area.html)

### 2. How to create gradient fills that fade toward the zero line?

**Decision**: Use Canvas gradient with `createLinearGradient()` combined with `fill.above`/`fill.below`

**Rationale**: Chart.js accepts Canvas gradient objects as colors. By creating a vertical gradient from the line position to zero, we achieve the fade effect. The gradient is created dynamically in a scriptable `backgroundColor` function to handle chart resizing. Combined with fill above/below, we can use different gradient directions (downward for positive values, upward for negative values).

**Implementation approach**:
```javascript
fill: {
  target: 'origin',
  above: (ctx) => createPositiveGradient(ctx),
  below: (ctx) => createNegativeGradient(ctx)
}
```

**Alternatives considered**:
- Fixed gradient (non-responsive): Would break on resize
- CSS gradients: Not supported by Canvas rendering
- Solid colors with opacity: Doesn't achieve the fade effect specified

**Source**: [Chart.js Linear Gradient](https://www.chartjs.org/docs/latest/samples/advanced/linear-gradient.html)

### 3. How to add a dashed zero reference line?

**Decision**: Use Chart.js scale grid configuration instead of annotation plugin

**Rationale**: The `chartjs-plugin-annotation` is not currently installed. Rather than adding a new dependency, we can achieve the zero line using the y-axis grid configuration with `drawOnChartArea: true` and a custom callback to only draw at zero. However, this approach is limited. A simpler and more reliable approach is to use a second hidden dataset at y=0 with `borderDash` styling.

**Alternative approach (preferred)**: Draw zero line using scale `grid.color` as a callback:
```javascript
scales: {
  y: {
    grid: {
      color: (context) => context.tick.value === 0 ? 'rgba(255,255,255,0.3)' : 'transparent'
    }
  }
}
```

Or use the `beforeDraw` hook to manually draw the line.

**Alternatives considered**:
- `chartjs-plugin-annotation`: Would require adding a new dependency
- Manual canvas drawing in plugin: More control but more code
- Hidden dataset at y=0: Works but adds complexity to data management

**Source**: [Chart.js Axis Styling](https://www.chartjs.org/docs/latest/axes/styling.html)

### 4. How to style line segments based on value (positive/negative)?

**Decision**: Use `segment` scriptable option with context checking

**Rationale**: Chart.js 4.x `segment` option allows per-segment styling. The callback receives context with `p0` and `p1` containing parsed y-values. We can check if values are above/below zero to apply different colors.

**Implementation**:
```javascript
segment: {
  borderColor: (ctx) => {
    // Color based on endpoint value
    const y1 = ctx.p1.parsed.y;
    return y1 >= 0 ? COLORS.positive : COLORS.negative;
  }
}
```

**Note**: For segments crossing zero, this approach colors based on the endpoint. For a perfect zero-crossing split, a more complex approach using Chart.js plugins or data preprocessing would be needed. Given spec requirements, endpoint-based coloring is acceptable.

**Source**: [Chart.js Line Segments](https://www.chartjs.org/docs/latest/samples/line/segments.html)

### 5. How to minimize/remove grid lines?

**Decision**: Set `grid.display: false` or use minimal styling

**Rationale**: Chart.js allows complete control over grid line visibility via `scales.x.grid` and `scales.y.grid` options.

**Implementation**:
```javascript
scales: {
  x: { grid: { display: false } },
  y: { grid: { display: false } }  // Or keep y-grid minimal for zero line
}
```

**Source**: [Chart.js Grid Configuration](https://www.chartjs.org/docs/latest/axes/styling.html)

### 6. Line thickness and data point markers

**Decision**: Use `borderWidth: 3` and `pointRadius: 4-5`

**Rationale**: Spec mentions "approximately 3px" for line thickness and "standard data point dots". Chart.js `borderWidth` controls line thickness directly. Point markers are configured via `pointRadius`, `pointBackgroundColor`, etc.

**Implementation**:
```javascript
{
  borderWidth: 3,
  pointRadius: 4,
  pointBackgroundColor: // same as line color or white
  pointBorderColor: // same as line color
}
```

## Dependencies Check

| Dependency | Status | Notes |
|------------|--------|-------|
| Chart.js 4.4 | Installed | Core charting library |
| vue-chartjs 5.2 | Installed | Vue wrapper |
| Filler plugin | Registered | Required for fill functionality |
| Annotation plugin | NOT INSTALLED | Not needed - using grid callback approach |

## Technical Risks

1. **Zero-crossing gradient complexity**: Creating gradients that perfectly split at zero requires knowing the pixel position of zero on the y-axis. This is solvable using `chart.scales.y.getPixelForValue(0)`.

2. **Performance with many data points**: Scriptable options are called for each segment. For large datasets, this could impact performance. Mitigation: cache computed values where possible.

3. **Responsive gradient recreation**: Gradients must be recreated on chart resize. Use the `beforeDraw` plugin hook or scriptable backgroundColor.

## Implementation Strategy

1. **Update ForecastChart.vue** to accept/generate enhanced chart configuration
2. **Create helper functions** for gradient creation and segment styling
3. **Configure scales** for minimal grid lines with zero line highlight
4. **Add comprehensive tests** for visual configuration options
5. **Use existing theme colors** from finance.css (already defined)

## Theme Colors (from constitution/finance.css)

```javascript
const CHART_COLORS = {
  positive: '#4ADE80',      // Mint green
  negative: '#F87171',      // Soft coral
  neutral: '#9CA3AF',       // Gray
  zeroLine: 'rgba(255, 255, 255, 0.2)'  // Subtle white for zero reference
}
```
