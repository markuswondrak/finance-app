package spend

import (
	"time"

	"wondee/finance-app-backend/internal/platform/types"
)

// MonthlyPaymentStatus tracks which fixed costs are included in save-to-spend
// AND their payment status for a specific month.
//
// Key semantics:
// - Record exists → cost is included in save-to-spend for that month
// - No record → cost is excluded from save-to-spend
// - IsPaid=false → cost is pending (deducted from safe-to-spend)
// - IsPaid=true → cost is paid (not deducted)
type MonthlyPaymentStatus struct {
	ID          uint            `gorm:"primaryKey"`
	WorkspaceID uint            `gorm:"not null;uniqueIndex:idx_mps_unique,priority:1"`
	FixedCostID int             `gorm:"not null;uniqueIndex:idx_mps_unique,priority:2"`
	Month       types.YearMonth `gorm:"type:string;not null;uniqueIndex:idx_mps_unique,priority:3"`
	IsPaid      bool            `gorm:"default:false"`
	PaidAt      *time.Time
}

// TableName specifies the table name for GORM
func (MonthlyPaymentStatus) TableName() string {
	return "monthly_payment_statuses"
}
