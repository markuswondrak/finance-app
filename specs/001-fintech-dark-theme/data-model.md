# Data Model: Fintech Dark Mode Theme

**Feature Branch**: `001-fintech-dark-theme`
**Date**: 2025-12-13

## Overview

This feature is frontend-only and does not introduce database entities. The "data model" consists of theme configuration objects managed by Vuetify's theming system.

---

## Theme Configuration Entities

### 1. Color Palette

**Location**: `/frontend/src/plugins/vuetify.js`

```typescript
interface ColorPalette {
  // Base colors
  background: string;      // '#121212' - Deep dark background
  surface: string;         // '#1E1E1E' - Card surfaces
  'surface-bright': string; // '#2A2A2A' - Elevated surfaces
  'surface-light': string;  // '#333333' - Lighter surfaces
  'surface-variant': string; // '#424242' - Variant surfaces

  // Financial indicator colors
  positive: string;        // '#4ADE80' - Mint green for income/surplus
  negative: string;        // '#F87171' - Soft coral for expense/deficit
  neutral: string;         // '#9CA3AF' - Gray for zero values

  // Semantic colors
  primary: string;         // '#00B8D4' - Primary accent (unchanged)
  secondary: string;       // '#7C4DFF' - Secondary accent (unchanged)
  success: string;         // '#4ADE80' - Alias to positive
  error: string;           // '#F87171' - Alias to negative
  warning: string;         // '#FFB300' - Warnings (unchanged)
  info: string;            // '#00B8D4' - Informational (unchanged)

  // Legacy aliases (for backward compatibility)
  income: string;          // '#4ADE80' - Alias to positive
  expense: string;         // '#F87171' - Alias to negative
}
```

### 2. Typography Configuration

**Location**: Applied via Vuetify utility classes in components

```typescript
interface TypographyScale {
  // Key financial figures
  keyFigure: {
    class: 'text-h4 font-weight-bold';
    fontSize: '34px';
    fontWeight: 700;
  };

  // Secondary figures
  secondaryFigure: {
    class: 'text-h5 font-weight-medium';
    fontSize: '24px';
    fontWeight: 500;
  };

  // Labels and descriptions
  label: {
    class: 'text-body-2 text-medium-emphasis';
    fontSize: '14px';
    opacity: 0.7;
  };
}
```

### 3. Shape Configuration

**Location**: Applied via Vuetify `rounded` prop

```typescript
interface ShapeConfig {
  // Card border radius
  cardRadius: 'xl';        // Maps to 16px

  // Container border radius
  containerRadius: 'lg';   // Maps to 12px

  // Button border radius
  buttonRadius: 'lg';      // Maps to 12px
}
```

### 4. Elevation Configuration

**Location**: Applied via Vuetify `elevation` prop

```typescript
interface ElevationConfig {
  // Main content cards
  mainCard: 4;

  // Nested/secondary cards
  nestedCard: 2;

  // Dialogs/modals
  dialog: 8;
}
```

---

## CSS Utility Classes

**Location**: `/frontend/src/finance.css`

| Class | Purpose | Value |
|-------|---------|-------|
| `.text-positive` | Positive financial values | `color: #4ADE80` |
| `.text-negative` | Negative financial values | `color: #F87171` |
| `.text-neutral` | Zero values | `color: #9CA3AF` |
| `.bg-positive` | Positive background | `background-color: #4ADE80` |
| `.bg-negative` | Negative background | `background-color: #F87171` |

---

## Chart Color Constants

**Location**: `/frontend/src/components/overview/OverviewChart.vue`

```typescript
const CHART_COLORS = {
  positive: '#4ADE80';      // Mint green line/points
  negative: '#F87171';      // Coral for negative segments
  neutral: '#9CA3AF';       // Gray for neutral
  fill: 'rgba(74, 222, 128, 0.2)';  // Mint green fill (20% opacity)
  gridLine: '#333333';      // Dark grid lines
  text: '#FFFFFF';          // White axis labels
};
```

---

## State Transitions

Not applicable - theme configuration is static. No dynamic state changes occur at runtime for this feature (dark mode is the only theme per spec).

---

## Validation Rules

| Entity | Rule | Enforcement |
|--------|------|-------------|
| Color values | Must be valid hex colors | Vuetify theme validation |
| Contrast ratios | Must meet WCAG AA (4.5:1 normal, 3:1 large) | Manual verification |
| Border radius | Must use Vuetify presets (sm/md/lg/xl) | Code review |
| Elevation | Must be 0-24 range | Vuetify prop validation |

---

## Relationships

```
Theme Configuration
├── Color Palette
│   ├── Base Colors (background, surfaces)
│   ├── Financial Colors (positive, negative, neutral)
│   └── Semantic Colors (primary, secondary, etc.)
├── Typography Scale
│   ├── Key Figures (text-h4)
│   ├── Secondary Figures (text-h5)
│   └── Labels (text-body-2)
├── Shape Config
│   └── Border Radius (xl/lg presets)
└── Elevation Config
    └── Shadow Levels (2/4/8)
```

---

## Migration Notes

No database migrations required. Theme changes are applied through:
1. Updating Vuetify theme configuration
2. Updating CSS utility classes
3. Updating component props/classes
