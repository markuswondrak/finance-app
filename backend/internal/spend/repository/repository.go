package repository

import (
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/spend"
	"wondee/finance-app-backend/internal/workspace"

	"gorm.io/gorm"
)

// Repository defines the interface for spend domain data access
type Repository interface {
	// Workspace operations
	GetWorkspace(workspaceID uint) (*workspace.Workspace, error)
	UpdateSaveToSpendBalance(workspaceID uint, amount int) error

	// MonthlyPaymentStatus operations
	GetPaymentStatuses(workspaceID uint, month types.YearMonth) ([]spend.MonthlyPaymentStatus, error)
	CountPaymentStatuses(workspaceID uint, month types.YearMonth) (int64, error)
	CreatePaymentStatus(status *spend.MonthlyPaymentStatus) error
	UpdatePaymentStatus(status *spend.MonthlyPaymentStatus) error
	DeletePaymentStatus(workspaceID uint, fixedCostID int, month types.YearMonth) error
	GetPaymentStatus(workspaceID uint, fixedCostID int, month types.YearMonth) (*spend.MonthlyPaymentStatus, error)

	// OneTimePendingCost operations
	GetOneTimeCosts(workspaceID uint, month types.YearMonth) ([]spend.OneTimePendingCost, error)
	CreateOneTimeCost(cost *spend.OneTimePendingCost) error
	UpdateOneTimeCost(cost *spend.OneTimePendingCost) error
	DeleteOneTimeCost(id uint, workspaceID uint) error
	GetOneTimeCost(id uint, workspaceID uint) (*spend.OneTimePendingCost, error)
}

// PostgresRepository implements Repository using GORM
type PostgresRepository struct {
	DB *gorm.DB
}
