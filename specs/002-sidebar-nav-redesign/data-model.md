# Data Model & Component Interface

## Component: `AppSidebar.vue`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `null` | Controls the visibility of the drawer (v-model for drawer). Mainly for mobile. |
| `rail` | `boolean` | `false` | Controls the "Rail" (mini) mode of the sidebar. |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when drawer visibility changes (e.g. clicking outside on mobile). |
| `update:rail` | `boolean` | Emitted when rail state changes (if controllable from within). |

### Internal State (Reactive)

- `navigationItems`: Array of objects defining the menu structure.

### Navigation Item Structure

```typescript
interface NavigationItem {
  title: string;
  to: string;       // Router path
  icon: string;     // FontAwesome or MDI icon class
  exact?: boolean;  // For router-link active matching
}

interface NavigationSection {
  header?: string;  // Section title (e.g., "MISCELLANEOUS")
  items: NavigationItem[];
}
```

## Component: `Layout.vue` (Parent)

The `Layout.vue` will manage the state for `drawer` (mobile visibility) and `rail` (desktop collapse).

- **State**:
  - `drawer`: boolean
  - `rail`: boolean
