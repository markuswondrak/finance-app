# Research: Sidebar Navigation Redesign

## 1. Active State Styling (Vertical Accent Bar)

**Problem**: The requirement calls for a "distinctive vertical accent bar" on the active navigation item. Vuetify's default active state usually changes text/background color.

**Options**:
1.  **Border Property**: Use CSS `border-left`.
    *   *Pros*: Simple.
    *   *Cons*: Might affect layout width if not handled carefully (though `box-sizing: border-box` usually handles it).
2.  **Box Shadow**: Use `box-shadow: inset`.
    *   *Pros*: Doesn't affect layout.
    *   *Cons*: Might conflict with other shadows.
3.  **Pseudo-element**: Use `::before` or `::after` on the active class.
    *   *Pros*: Flexible positioning, can be absolutely positioned to overlay or sit to the side without affecting flow.
    *   *Cons*: Slightly more CSS.

**Decision**: **Pseudo-element (`::before`)**.
**Rationale**: It allows precise positioning of the bar (e.g., 4px width, full height) without shifting the content or affecting the padding of the list item. We will apply this via a custom class (e.g., `.nav-item-active`) passed to `v-list-item`'s `active-class` prop.

```css
.nav-item-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: currentColor; /* Uses the active color */
  border-radius: 0 4px 4px 0;
}
```

## 2. Responsive & Rail Mode Logic

**Problem**:
- Desktop: Toggle between Expanded and Rail (Icon-only).
- Mobile: Toggle between Hidden and Expanded (Overlay).

**Technical Approach**:
- Use Vuetify's Display Interface (`useDisplay`) to detect mobile vs. desktop.
- **State**:
  - `drawer`: Boolean (controls visibility on mobile).
  - `rail`: Boolean (controls collapsed state on desktop).
- **Logic**:
  - `mobile`: Use `v-navigation-drawer` with `temporary` variant.
  - `desktop`: Use `v-navigation-drawer` with `permanent` variant and `:rail="rail"`.
  - The "Toggle" button (hamburger) action depends on the context:
    - If Mobile: `drawer = !drawer`
    - If Desktop: `rail = !rail`

**Decision**: Implement a computed property or watcher for the drawer variant/props based on `mobile` breakpoint.

## 3. Branding Header in Rail Mode

**Problem**: In Rail mode, the sidebar width shrinks. The full logo + title won't fit. Requirement: "App Title is hidden, Logo Icon centers horizontally."

**Approach**:
- Pass the `rail` prop to the header section (or check it if in scope).
- Use `v-slide-x-transition` or simple `v-if` for the Title text.
- Ensure the Logo container has `width: 100%` and `display: flex; justify-content: center` to center the icon when in rail mode.
- **Height**: Must match `v-app-bar` height (usually 64px).

**Decision**: Create a custom header slot/area in the `AppSidebar` component that reacts to the `rail` prop.

## 4. Section Headers (Rail Mode)

**Problem**: "Section headers MUST ... transform into a simple visual divider in Rail mode."

**Approach**:
- Use `v-divider` that is always visible.
- Use a `v-list-subheader` for the text ("MISCELLANEOUS").
- In Rail mode, hide the `v-list-subheader` (using CSS or `v-if`) and keep the `v-divider`.
- Actually, the `v-divider` should probably be the only thing visible in rail mode.

**Decision**:
- Structure:
  ```html
  <v-divider />
  <v-list-subheader v-if="!rail">MISCELLANEOUS</v-list-subheader>
  ```
- This ensures that when collapsed, only the line remains, acting as a logical separator.
