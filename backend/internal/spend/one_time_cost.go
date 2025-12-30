package spend

import (
	"time"

	"wondee/finance-app-backend/internal/platform/types"
)

// OneTimePendingCost represents a one-time pending cost (credit cards, pending purchases)
// scoped to the save-to-spend feature for a specific month.
//
// Lifecycle:
// 1. Created when user adds one-time cost
// 2. IsPaid = true when marked as paid (removes from calculation)
// 3. Automatically excluded when Month != current month (lazy cleanup)
type OneTimePendingCost struct {
	ID          uint            `gorm:"primaryKey"`
	WorkspaceID uint            `gorm:"not null;index:idx_otp_ws_month,priority:1"`
	Name        string          `gorm:"not null"`
	Amount      int             `gorm:"not null"` // Amount in cents
	Month       types.YearMonth `gorm:"type:string;not null;index:idx_otp_ws_month,priority:2"`
	IsPaid      bool            `gorm:"default:false"`
	CreatedAt   time.Time
}

// TableName specifies the table name for GORM
func (OneTimePendingCost) TableName() string {
	return "one_time_pending_costs"
}
