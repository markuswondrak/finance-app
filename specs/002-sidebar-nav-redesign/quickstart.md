# Quickstart Guide: Sidebar Navigation Redesign

## Verification Steps

1.  **Start the frontend**:
    ```bash
    cd frontend
    pnpm dev
    ```

2.  **Desktop Verification**:
    - Open `http://localhost:5173` (or provided port).
    - Ensure the window width is large (> 1280px).
    - **Check**: Sidebar should be visible in "Expanded" mode by default (or user preference).
    - **Check**: Top header of sidebar contains Logo and "Finanz-App".
    - **Action**: Click the hamburger menu in the top bar.
    - **Check**: Sidebar toggles to "Rail" mode (only icons visible).
    - **Check**: Sidebar header hides "Finanz-App" and centers the Logo.
    - **Check**: Hover over icons to see tooltips (if implemented) or just verify icons are centered.

3.  **Mobile Verification**:
    - Resize browser to mobile width (< 600px) or use DevTools Device Mode.
    - **Check**: Sidebar is hidden by default.
    - **Action**: Click the hamburger menu.
    - **Check**: Sidebar opens as an overlay (covers content).
    - **Check**: Sidebar is in "Expanded" mode (Rail mode is disabled on mobile).
    - **Action**: Click outside the sidebar.
    - **Check**: Sidebar closes.

4.  **Active State Verification**:
    - Navigate to "Fixkosten".
    - **Check**: The "Fixkosten" item has a vertical accent bar on the left (or chosen side) and is visually distinct.
    - Navigate to "Overview".
    - **Check**: The accent bar moves to "Overview".
