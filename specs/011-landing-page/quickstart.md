# Quickstart: Landing Page

**Feature**: `011-landing-page`

## Prerequisites
- Node.js & npm/pnpm installed.
- Backend running (optional, for auth redirection, but page works standalone).

## Running the Feature

1. **Start the Frontend**:
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

2. **Access the Landing Page**:
   - Open browser to `http://localhost:8080/` (or configured port).
   - **Condition**: Ensure you are **logged out** (clear localStorage or open Incognito window). If logged in, you will be redirected to `/overview`.

## Verifying Visuals

1. **Hero Section**:
   - Check if title is "Master Your Tomorrow...".
   - Verify 3D tilt on the chart image (desktop only).
   - Verify chart "drawing" animation plays on load.

2. **Feature Grid**:
   - Scroll down. Check if cards fade in up.
   - Hover over cards to check glassmorphism (transparency/border).

3. **Interactive Preview**:
   - Verify the "Lowest Balance" card is visible and uses the theme colors.

4. **Responsiveness**:
   - Resize browser to mobile width (< 600px).
   - Verify chart image un-tilts or stacks correctly.
   - Verify grid becomes a single column.

## Troubleshooting

- **Redirect loops**: Clear application storage (DevTools -> Application -> Local Storage).
- **Missing assets**: Ensure FontAwesome/Icons are loaded in `index.html` or main entry point.
