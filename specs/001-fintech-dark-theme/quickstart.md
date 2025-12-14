# Quickstart: Fintech Dark Mode Theme

**Feature Branch**: `001-fintech-dark-theme`
**Date**: 2025-12-13

## Prerequisites

- Node.js (check with `node --version`)
- pnpm package manager
- Docker (for PostgreSQL database)

## Setup

### 1. Clone and Switch Branch

```bash
git checkout 001-fintech-dark-theme
```

### 2. Install Dependencies

```bash
cd frontend
pnpm install
```

### 3. Start Development Server

```bash
# Start database (from repo root)
docker-compose up -d

# Start backend (from repo root)
cd backend && go run main.go

# Start frontend (new terminal)
cd frontend && pnpm dev
```

### 4. Access Application

Open http://localhost:8081 in your browser.

---

## Key Files to Modify

| File | Purpose |
|------|---------|
| `frontend/src/plugins/vuetify.js` | Theme color palette configuration |
| `frontend/src/finance.css` | CSS utility classes for colors |
| `frontend/src/components/overview/OverviewChart.vue` | Chart color constants |
| `frontend/src/components/**/*.vue` | Apply `rounded="xl"` and typography classes |

---

## Theme Color Reference

### Financial Indicators

| Type | Color | Hex | Usage |
|------|-------|-----|-------|
| Positive | Mint Green | `#4ADE80` | Income, surplus, growth |
| Negative | Soft Coral | `#F87171` | Expense, deficit, decline |
| Neutral | Gray | `#9CA3AF` | Zero values |

### Surfaces

| Type | Hex | Usage |
|------|-----|-------|
| Background | `#121212` | Page background |
| Surface | `#1E1E1E` | Card background |
| Surface Bright | `#2A2A2A` | Elevated elements |

---

## Implementation Checklist

### Phase 1: Theme Configuration
- [ ] Update `vuetify.js` with new color palette
- [ ] Add `positive`, `negative`, `neutral` colors to theme
- [ ] Update `finance.css` utility classes

### Phase 2: Component Updates
- [ ] Add `rounded="xl"` to all `v-card` components
- [ ] Add `elevation="4"` to main cards
- [ ] Apply typography classes to financial figures

### Phase 3: Chart Updates
- [ ] Update `OverviewChart.vue` with new color constants
- [ ] Align point/line colors with theme

### Phase 4: Testing
- [ ] Run existing tests: `pnpm test`
- [ ] Add/update snapshot tests for modified components
- [ ] Manual visual QA on all screens

---

## Running Tests

```bash
cd frontend

# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test -- OverviewChart
```

---

## Verification Steps

1. **Dark Background**: All screens display `#121212` background
2. **Card Styling**: Cards have rounded corners (xl) and elevation
3. **Positive Values**: Income/surplus displays in mint green (#4ADE80)
4. **Negative Values**: Expense/deficit displays in coral (#F87171)
5. **Zero Values**: Display in neutral gray (#9CA3AF)
6. **Typography**: Key figures are large and bold, labels are smaller and muted
7. **Chart Colors**: Line chart uses theme-aligned colors
8. **Contrast**: All text readable (WCAG AA: 4.5:1 minimum)

---

## Troubleshooting

### Colors not updating
- Clear browser cache
- Restart Vite dev server: `pnpm dev`
- Check for CSS specificity conflicts in finance.css

### Tests failing
- Update snapshots if intentional: `pnpm test -- -u`
- Check component props match new theme classes

### Chart colors not changing
- Chart.js colors are hardcoded in component
- Update `CHART_COLORS` constant in `OverviewChart.vue`
