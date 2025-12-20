# Data Model: Fixed Cost Savings

**Feature**: `013-fixed-cost-savings`
**Date**: 2025-12-20

## Database Schema Changes

### `fixed_costs` Table

| Column Name | Type | Nullable | Default | Description |
|:---|:---|:---|:---|:---|
| `is_saving` | BOOLEAN | NO | `false` | Flag indicating if this cost is a saving/investment. |

### `special_costs` Table

| Column Name | Type | Nullable | Default | Description |
|:---|:---|:---|:---|:---|
| `is_saving` | BOOLEAN | NO | `false` | Flag indicating if this cost is a saving/investment. |

## Entity Definitions

### FixedCost (Go Struct)

```go
type FixedCost struct {
    // ... existing fields
    IsSaving bool `json:"isSaving"`
}
```

### SpecialCost (Go Struct)

```go
type SpecialCost struct {
    // ... existing fields
    IsSaving bool `json:"isSaving"`
}
```

## API Models

### JsonFixedCost

```go
type JsonFixedCost struct {
    // ... existing fields
    IsSaving bool `json:"isSaving"`
}
```

### JsonSpecialCost (Implied)

Must also include `isSaving` field in the JSON response/request.
