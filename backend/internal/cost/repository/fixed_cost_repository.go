package repository

import (
	"sort"
	"wondee/finance-app-backend/internal/cost"
)

func (r *PostgresRepository) LoadFixedCosts(workspaceID uint) *[]cost.FixedCost {
	var costs []cost.FixedCost
	r.DB.Where("workspace_id = ?", workspaceID).Find(&costs)

	sort.Slice(costs, func(i, j int) bool {
		isIncomeI := costs[i].Amount >= 0
		isIncomeJ := costs[j].Amount >= 0

		if isIncomeI != isIncomeJ {
			return isIncomeI
		}

		return costs[i].Name < costs[j].Name
	})

	return &costs
}

func (r *PostgresRepository) LoadFixedCostsByUser(userID uint) *[]cost.FixedCost {
	var costs []cost.FixedCost
	r.DB.Where("user_id = ?", userID).Find(&costs)
	return &costs
}

func (r *PostgresRepository) SaveFixedObject(cost *cost.FixedCost) {
	if cost.ID == 0 {
		r.DB.Create(cost)
	} else {
		r.DB.Save(cost)
	}
}

func (r *PostgresRepository) DeleteFixedCost(id int, workspaceID uint) {
	r.DB.Where("workspace_id = ?", workspaceID).Delete(&cost.FixedCost{}, id)
}
