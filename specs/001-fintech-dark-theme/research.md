# Research: Fintech Dark Mode Theme

**Feature Branch**: `001-fintech-dark-theme`
**Date**: 2025-12-13

## Research Summary

All technical unknowns have been resolved. This document captures decisions, rationale, and alternatives for the Fintech Dark Mode Theme implementation.

---

## 1. Color Palette Selection (Mint Green / Coral)

### Decision
Use Vuetify theme system with the following color values:
- **Positive/Income**: `#4ADE80` (Mint Green - Tailwind green-400)
- **Negative/Expense**: `#F87171` (Soft Coral - Tailwind red-400)
- **Neutral/Zero**: `#9CA3AF` (Gray - Tailwind gray-400)

### Rationale
- These colors provide WCAG AA compliant contrast ratios against the dark background (#121212):
  - Mint Green (#4ADE80) on #121212: ~9.5:1 contrast ratio (exceeds 4.5:1)
  - Soft Coral (#F87171) on #121212: ~6.5:1 contrast ratio (exceeds 4.5:1)
- Colors align with the "mint green" and "soft red/coral" descriptions in the spec
- Part of widely-recognized color families for positive/negative financial indicators
- Vuetify 3 allows custom colors in the theme configuration without additional dependencies

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|-----------------|
| Vuetify default success/error | Too saturated (#00C853/#FF5252) - not "soft" coral as spec requires |
| Material Design palette | Limited mint green options in standard palette |
| Custom CSS variables only | Would bypass Vuetify's theming system, harder to maintain |

### Sources
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

---

## 2. Border Radius Implementation

### Decision
Use Vuetify's `rounded="xl"` prop on all cards and containers, which maps to `16px` border radius.

### Rationale
- Vuetify 3 provides built-in rounded classes: `sm` (4px), `md` (8px), `lg` (12px), `xl` (16px)
- `xl` provides a "large radius" as specified without custom CSS
- Consistent with Material Design 3 guidelines for elevated surfaces
- Applied via prop (`rounded="xl"`) rather than CSS class for type safety

### Implementation Approach
```vue
<v-card rounded="xl" elevation="4">
  <!-- content -->
</v-card>
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|-----------------|
| Custom CSS (`border-radius: 24px`) | Inconsistent with Vuetify system |
| `rounded-pill` | Too extreme for cards (fully rounded ends) |
| `rounded="lg"` (12px) | Spec calls for "large" - xl is more impactful |

### Sources
- [Vuetify Border Radius](https://vuetifyjs.com/en/styles/border-radius/)

---

## 3. Typography Scale for Financial Figures

### Decision
Use Vuetify's typography classes with these mappings:
- **Key financial figures**: `text-h4` + `font-weight-bold` (34px, bold)
- **Secondary figures**: `text-h5` + `font-weight-medium` (24px, medium)
- **Labels/descriptions**: `text-body-2` + `text-medium-emphasis` (14px, muted)

### Rationale
- Leverages Vuetify's Material Design typography scale
- Creates clear visual hierarchy: key numbers dominate, labels support
- `text-medium-emphasis` uses Vuetify's built-in opacity for muted text
- No custom font sizes needed - keeps styling maintainable

### Implementation Approach
```vue
<div class="text-h4 font-weight-bold text-success">€12,450.00</div>
<div class="text-body-2 text-medium-emphasis">Current Balance</div>
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|-----------------|
| Custom CSS font sizes | Harder to maintain, inconsistent with Vuetify |
| Inline styles | Not reusable, harder to test |
| Separate typography CSS file | Adds complexity without benefit |

### Sources
- [Vuetify Typography](https://vuetifyjs.com/en/styles/text-and-typography/)

---

## 4. Chart.js Color Integration

### Decision
Update hardcoded colors in `OverviewChart.vue` to use theme-aligned colors. Chart.js does not natively integrate with Vuetify themes, so colors will be hardcoded but aligned with the theme palette.

### Rationale
- Chart.js 4.x does not support CSS variables or Vuetify theme injection
- Per the clarification session, "limited coloring capabilities are acceptable"
- Colors will be defined as constants at the top of the component for maintainability

### Implementation Approach
```javascript
// Theme-aligned chart colors
const CHART_COLORS = {
  positive: '#4ADE80',  // Mint green
  negative: '#F87171',  // Soft coral
  neutral: '#9CA3AF',   // Gray
  line: 'rgba(74, 222, 128, 0.2)',  // Mint green fill
  border: '#4ADE80'
};
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|-----------------|
| Use Vuetify's useTheme() composable | Chart.js doesn't accept Vuetify theme references |
| CSS custom properties in chart | Chart.js canvas rendering doesn't support CSS variables |
| Replace Chart.js with ApexCharts | Out of scope, introduces new dependency |

### Sources
- [vue-chartjs documentation](https://vue-chartjs.org/)

---

## 5. Testing Approach for Visual Changes

### Decision
Use component snapshot testing with Vitest for structural changes, and manual visual QA for color/styling verification.

### Rationale
- Project already uses Vitest with Vue Test Utils (see `package.json`)
- Existing test suite has 25+ component tests with good coverage patterns
- Snapshot testing captures component structure changes (props, classes)
- Visual regression testing (screenshot comparison) requires additional tooling not in scope
- Manual QA is appropriate for initial theme implementation; visual regression can be added later

### Test Strategy
1. **Unit tests**: Verify components accept and apply correct CSS classes
2. **Snapshot tests**: Capture rendered component structure with new theme classes
3. **Manual QA**: Visual inspection across all screens per SC-001

### Implementation Approach
```javascript
it('should apply positive color class for surplus values', () => {
  const wrapper = mount(CurrentAmount, {
    props: { amount: 100, isPositive: true }
  });
  expect(wrapper.classes()).toContain('text-positive');
});
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|-----------------|
| Percy/Chromatic visual testing | Additional SaaS dependency, out of scope |
| jest-image-snapshot | Requires Puppeteer setup, adds complexity |
| Storybook visual tests | No Storybook in project currently |

### Sources
- [Vitest Snapshot Testing](https://vitest.dev/guide/snapshot)
- [Vue School Snapshot Testing](https://vueschool.io/articles/vuejs-tutorials/snapshot-testing/)

---

## 6. Shadow/Elevation for Cards

### Decision
Use Vuetify's `elevation="4"` prop for main content cards, `elevation="2"` for nested cards.

### Rationale
- Vuetify provides elevation scale from 0-24
- Elevation 4 provides visible shadow on dark backgrounds without being overwhelming
- Consistent with Material Design dark theme guidelines
- Applied via prop for consistency

### Implementation Approach
```vue
<v-card rounded="xl" elevation="4">
  <!-- Main card content -->
</v-card>
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|-----------------|
| Custom box-shadow CSS | Inconsistent with Vuetify system |
| Higher elevation (8+) | Too heavy for fintech aesthetic |
| No elevation | Cards don't separate from background |

---

## Summary: All Unknowns Resolved

| Unknown | Resolution |
|---------|------------|
| Specific color hex values | #4ADE80 (mint), #F87171 (coral), #9CA3AF (neutral) |
| Border radius value | Vuetify `xl` preset (16px) |
| Typography scale | Vuetify text-h4/h5/body-2 classes |
| Chart color integration | Hardcoded aligned colors (Chart.js limitation accepted) |
| Testing approach | Snapshot + unit tests + manual QA |
| Card elevation | Vuetify elevation="4" |

**Next Phase**: Generate data-model.md and contracts
