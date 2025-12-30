package repository

import (
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/spend"
	"wondee/finance-app-backend/internal/workspace"
)

// Workspace operations

func (r *PostgresRepository) GetWorkspace(workspaceID uint) (*workspace.Workspace, error) {
	var ws workspace.Workspace
	result := r.DB.First(&ws, workspaceID)
	if result.Error != nil {
		return nil, result.Error
	}
	return &ws, nil
}

func (r *PostgresRepository) UpdateSaveToSpendBalance(workspaceID uint, amount int) error {
	return r.DB.Model(&workspace.Workspace{}).
		Where("id = ?", workspaceID).
		Update("save_to_spend_balance", amount).Error
}

// MonthlyPaymentStatus operations

func (r *PostgresRepository) GetPaymentStatuses(workspaceID uint, month types.YearMonth) ([]spend.MonthlyPaymentStatus, error) {
	var statuses []spend.MonthlyPaymentStatus
	monthStr, _ := month.Value()
	result := r.DB.Where("workspace_id = ? AND month = ?", workspaceID, monthStr).Find(&statuses)
	if result.Error != nil {
		return nil, result.Error
	}
	return statuses, nil
}

func (r *PostgresRepository) CountPaymentStatuses(workspaceID uint, month types.YearMonth) (int64, error) {
	var count int64
	monthStr, _ := month.Value()
	result := r.DB.Model(&spend.MonthlyPaymentStatus{}).
		Where("workspace_id = ? AND month = ?", workspaceID, monthStr).
		Count(&count)
	if result.Error != nil {
		return 0, result.Error
	}
	return count, nil
}

func (r *PostgresRepository) CreatePaymentStatus(status *spend.MonthlyPaymentStatus) error {
	return r.DB.Create(status).Error
}

func (r *PostgresRepository) UpdatePaymentStatus(status *spend.MonthlyPaymentStatus) error {
	return r.DB.Save(status).Error
}

func (r *PostgresRepository) DeletePaymentStatus(workspaceID uint, fixedCostID int, month types.YearMonth) error {
	monthStr, _ := month.Value()
	return r.DB.Where("workspace_id = ? AND fixed_cost_id = ? AND month = ?", workspaceID, fixedCostID, monthStr).
		Delete(&spend.MonthlyPaymentStatus{}).Error
}

func (r *PostgresRepository) GetPaymentStatus(workspaceID uint, fixedCostID int, month types.YearMonth) (*spend.MonthlyPaymentStatus, error) {
	var status spend.MonthlyPaymentStatus
	monthStr, _ := month.Value()
	result := r.DB.Where("workspace_id = ? AND fixed_cost_id = ? AND month = ?", workspaceID, fixedCostID, monthStr).First(&status)
	if result.Error != nil {
		return nil, result.Error
	}
	return &status, nil
}

// OneTimePendingCost operations

func (r *PostgresRepository) GetOneTimeCosts(workspaceID uint, month types.YearMonth) ([]spend.OneTimePendingCost, error) {
	var costs []spend.OneTimePendingCost
	monthStr, _ := month.Value()
	result := r.DB.Where("workspace_id = ? AND month = ?", workspaceID, monthStr).Find(&costs)
	if result.Error != nil {
		return nil, result.Error
	}
	return costs, nil
}

func (r *PostgresRepository) CreateOneTimeCost(cost *spend.OneTimePendingCost) error {
	return r.DB.Create(cost).Error
}

func (r *PostgresRepository) UpdateOneTimeCost(cost *spend.OneTimePendingCost) error {
	return r.DB.Save(cost).Error
}

func (r *PostgresRepository) DeleteOneTimeCost(id uint, workspaceID uint) error {
	return r.DB.Where("id = ? AND workspace_id = ?", id, workspaceID).
		Delete(&spend.OneTimePendingCost{}).Error
}

func (r *PostgresRepository) GetOneTimeCost(id uint, workspaceID uint) (*spend.OneTimePendingCost, error) {
	var cost spend.OneTimePendingCost
	result := r.DB.Where("id = ? AND workspace_id = ?", id, workspaceID).First(&cost)
	if result.Error != nil {
		return nil, result.Error
	}
	return &cost, nil
}
