# Data Model: Special Costs Page

**Entity**: `SpecialCost` (Frontend Representation)

## Fields

| Name | Type | Description | Validation |
| :--- | :--- | :--- | :--- |
| `id` | `Number` | Unique ID (0 for new) | Read-only |
| `name` | `String` | Description of cost | Required, Non-empty |
| `amount` | `Number` | Value in Cents/Euro | Non-zero |
| `dueDate` | `Object` | `{ year: 2025, month: 10 }` | Required, Valid Month/Year |

## Transformations

**Frontend Form State**:
- `displayAmount`: Positive Number (what user types)
- `type`: 'income' | 'expense' (Toggle state)
- `date`: Date Object or String (for picker binding)

**To Backend**:
- `amount` = `type === 'expense'` ? `-displayAmount` : `displayAmount`
- `dueDate` = Extract `{ year, month }` from `date`

**From Backend**:
- `displayAmount` = `Math.abs(amount)`
- `type` = `amount < 0` ? 'expense' : 'income'
- `date` = Create Date object from `dueDate.year`, `dueDate.month`

## API Contracts

**Endpoint**: `/api/specialcosts`

- **GET**: Returns `[]SpecialCost`
- **POST**: Accepts `SpecialCost` JSON
- **DELETE**: `/{id}`

## Component Data

**SpecialCosts.vue**:
- `items`: Array of `SpecialCost` (fetched from API)
- `showModal`: Boolean
- `selectedItem`: `SpecialCost` (for edit) or `null` (for create)

**SpecialCostForm.vue** (Props):
- `modelValue`: Boolean (dialog visibility)
- `item`: `SpecialCost` (optional, for editing)
