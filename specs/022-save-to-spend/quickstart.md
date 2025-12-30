# Quickstart: Save-To-Spend

**Feature**: `022-save-to-spend`

## Prerequisites

- **Backend**: Ensure the server is running (`go run backend/main.go`).
- **Frontend**: Ensure the frontend is running (`pnpm dev`).
- **Account**: You must be logged in to a workspace.
- **Data**: You should have some Fixed Costs defined in `/fixedcosts`.

## Usage

1. **Navigate**: Click on "Save to Spend" (Monatsspielraum) in the sidebar.
2. **Set Balance**: Click the edit icon (pencil) next to "Kontostand" and enter your current checking account balance.
3. **Review Fixed Costs**:
    - The list shows fixed costs relevant for this month.
    - **Include/Exclude**: If a cost (e.g., Groceries) shouldn't be deducted in a lump sum, click the "X" to exclude it. It will move to the bottom accordion.
    - **Mark Paid**: As costs are debited from your bank, check the box to mark them as "Paid". They will no longer be deducted from your "Safe to Spend" amount.
4. **Add One-Time Costs**:
    - Click "Hinzufügen" in the "Einmalige Kosten" section.
    - Enter a name (e.g., "Car Repair") and amount.
    - This cost is now deducted from your "Safe to Spend" until you mark it as paid or delete it.
5. **Result**: The large colored number at the top shows exactly how much you can spend right now without affecting your ability to pay pending bills.

## API Endpoints

- `GET /api/spend/save-to-spend`: Get dashboard data.
- `POST /api/spend/balance`: Set checking balance.
- `POST /api/spend/fixed-costs/{id}/paid`: Mark fixed cost paid.
- `POST /api/spend/fixed-costs/{id}/pending`: Mark fixed cost pending.
