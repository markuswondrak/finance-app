# Quickstart: Fixed Cost Savings

**Feature**: `013-fixed-cost-savings`

## Key Files

### Backend
- **FixedCost Model**: `backend/internal/models/fixedcost.go`
- **SpecialCost Model**: `backend/internal/models/specialcost.go`
- **FixedCost API**: `backend/internal/api/fixedcosts.go`
- **SpecialCost API**: `backend/internal/api/specialcosts.go`

### Frontend
- **Fixed Cost Form**: `frontend/src/components/editform/MonthlyCostEditForm.vue` (and others)
- **Special Cost Form**: `frontend/src/components/editform/SpecialCostForm.vue`
- **Cost Transformer**: `frontend/src/components/Utils.js`
- **Fixed Cost Table**: `frontend/src/components/FixedCostTable.vue`
- **Special Cost Table**: `frontend/src/components/SpecialCosts.vue` (likely contains table logic or separate component)

## Testing

### Backend
Run unit tests for API validation:
```bash
cd backend
go test ./internal/api/...
```

### Frontend
Run component tests:
```bash
cd frontend
pnpm test:unit
```
