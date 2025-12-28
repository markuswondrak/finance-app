package repository

import (
	"sort"
	"wondee/finance-app-backend/internal/cost"
)

func (r *PostgresRepository) LoadSpecialCosts(workspaceID uint) *[]cost.SpecialCost {
	var specialCosts []cost.SpecialCost
	r.DB.Where("workspace_id = ?", workspaceID).Find(&specialCosts)

	sort.Slice(specialCosts, func(i, j int) bool {
		d1 := specialCosts[i].DueDate
		d2 := specialCosts[j].DueDate

		if d1 == nil {
			return true
		}
		if d2 == nil {
			return false
		}

		if d1.Year != d2.Year {
			return d1.Year < d2.Year
		}
		return d1.Month < d2.Month
	})

	return &specialCosts
}

func (r *PostgresRepository) LoadSpecialCostsByUser(userID uint) *[]cost.SpecialCost {
	var specialCosts []cost.SpecialCost
	r.DB.Where("user_id = ?", userID).Find(&specialCosts)
	return &specialCosts
}

func (r *PostgresRepository) SaveSpecialCost(cost *cost.SpecialCost) {
	if cost.ID == 0 {
		r.DB.Create(cost)
	} else {
		r.DB.Save(cost)
	}
}

func (r *PostgresRepository) DeleteSpecialCost(id int, workspaceID uint) {
	r.DB.Where("workspace_id = ?", workspaceID).Delete(&cost.SpecialCost{}, id)
}
