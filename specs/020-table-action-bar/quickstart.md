# Quickstart: Redesign table interface with Action Bar

## Prerequisities

- Backend running (`go run main.go` or via docker)
- Frontend running (`pnpm dev`)

## Testing the Feature

1. **Navigate to Fixed Costs**:
   - Go to `/fixed-costs` (or click "Fixkosten" in nav).
   - Verify the "Action Bar" is visible above the tabs.
   - **Search**: Type a cost name. Verify the table updates instantly. Ensure typing an amount (e.g., "50") DOES NOT filter by amount unless it's part of the name.
   - **Time Filter**: Use the Datepicker to select a specific Month/Year (e.g., "Jan 2025"). Verify only costs active in that month are shown.
   - **Clear Filter**: Verify there is a way to clear the date selection (reset to "All Time").
   - **Add Button**: Click "Neue Kosten Hinzufügen" (top right). Verify the modal opens.
   - **Legacy Button**: Scroll down. Verify the old "Add" button is gone.

2. **Navigate to Special Costs**:
   - Go to `/special-costs` (or click "Sonderkosten" in nav).
   - Verify the "Action Bar" is visible.
   - **Search**: Type a name. Verify filtering.
   - **Time Filter**: Select a Month/Year. Verify only special costs due in that specific month appear.
   - **Add Button**: Click "Add New Cost". Verify modal opens.

3. **Mobile Test**:
   - Reduce browser width to < 600px.
   - Verify the Action Bar elements stack vertically (Search, Datepicker, Button).
   - Verify all controls are accessible.