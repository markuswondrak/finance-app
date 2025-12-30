# Research: Save-To-Spend

**Feature**: `022-save-to-spend`

## Problem Analysis

Users often check their bank balance to decide if they can afford a purchase. However, the bank balance is a "snapshot in time" that doesn't account for:
1.  Rent or bills that haven't been debited yet.
2.  Credit card bills that are pending.

This leads to "accidental overspending" where a user spends money that was actually "spoken for" by a pending bill.

## Solution Concept

A "Disposable Income" or "Safe-to-Spend" calculator.

**Formula**:
`Safe To Spend = Current Balance - (Sum of Pending Fixed Costs) - (Sum of Pending One-Time Costs)`

### Key Decisions

1.  **Manual Balance vs. PSD2 Sync**:
    - **Decision**: Manual Balance for MVP.
    - **Reasoning**: PSD2 integration is complex, requires licensing, and is high-effort. Manual entry is sufficient for users who check their finance app once a week or month.

2.  **Inclusion of Fixed Costs**:
    - **Issue**: Some "Fixed Costs" are actually budgets (e.g., "Food: 400€"). These are spent gradually, so deducting 400€ at the start of the month is wrong.
    - **Solution**: "Include/Exclude" toggle. Users explicitly select which costs are "Bills" (deduct immediately) vs "Budgets" (ignored by this tool).

3.  **One-Time Costs**:
    - **Issue**: Large one-off expenses (e.g., annual insurance not in fixed costs, or a repair bill).
    - **Solution**: Allow adding "One-Time Pending Costs" that exist only for the current month.

## References

- **YNAB (You Need A Budget)**: Philosophy of "Give every dollar a job".
- **Simple Bank (Defunct)**: Had a "Safe-to-Spend" feature that was highly praised.
