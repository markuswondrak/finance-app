# Quickstart: Wealth Profile Configuration

## Prerequisites
- Backend running (`go run main.go`)
- Frontend running (`npm run dev`)
- Database migrated (auto-migration should handle `wealth_profiles` table)

## Manual Testing Steps

1. **Navigate to Wealth Overview**
   - Log in to the application.
   - Click on "Vermögensübersicht" in the navigation menu.

2. **Verify Defaults (First Load)**
   - Confirm the "Forecast Settings" panel is visible at the top.
   - Expand it.
   - Verify fields are empty or show sensible placeholders.

3. **Configure & Save**
   - Enter:
     - Current Wealth: `50000`
     - Duration: `20`
     - Worst: `3`
     - Average: `5`
     - Best: `7`
   - Click "Save".
   - Verify success message (Snackbar).

4. **Verify Persistence**
   - Refresh the page.
   - Open the panel.
   - Verify the values entered above are populated.

5. **Test Validation**
   - Enter `-100` for Current Wealth.
   - Verify "Save" button is disabled or error is shown.
   - Enter `150` for Duration.
   - Verify validation error.
