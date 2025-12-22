# Quickstart: Wealth Overview Redesign

**Feature**: `018-wealth-overview-redesign`

## Prerequisites

- Backend running (`go run main.go` in `backend/cmd/server`)
- Frontend running (`pnpm dev` in `frontend`)
- User logged in

## Test Steps

1. **Navigate to Wealth Overview**:
   - Go to `http://localhost:8080/wealth`.
   - **Verify**: The old configuration panel is GONE.
   - **Verify**: Three highlight cards are visible at the top (Current Wealth, Time Horizon, Expected Return).

2. **Verify Card Content**:
   - **Current Wealth**: Check if the value matches your profile. Check the "milestone" text (e.g., "100k in 2030").
   - **Time Horizon**: Check the years. Check the "Final Portfolio" value.
   - **Expected Return**: Check the average rate. Check the spread text.

3. **Edit Current Wealth**:
   - Click the "Current Wealth" card.
   - **Verify**: A modal opens with the "Current Wealth" input.
   - Change the value (e.g., increase by 10k).
   - Click Save.
   - **Verify**: Modal closes. Notification "Settings saved" appears. Card value updates. Chart reloads.

4. **Edit Time Horizon**:
   - Click the "Time Horizon" card.
   - Change duration.
   - Save.
   - **Verify**: Chart axis updates to new duration.

5. **Edit Return Rates**:
   - Click "Expected Return" card.
   - **Verify**: Modal shows 3 inputs (Worst, Avg, Best).
   - Try to set Worst > Best.
   - **Verify**: Validation error prevents saving.
   - Fix values and Save.
   - **Verify**: Chart curves update.

6. **Responsiveness**:
   - Resize window to mobile width.
   - **Verify**: Cards stack vertically.
