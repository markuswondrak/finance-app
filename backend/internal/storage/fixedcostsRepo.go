package storage

import (
	"sort"
	"wondee/finance-app-backend/internal/models"
)

func (r *GormRepository) LoadFixedCosts(userID uint) *[]models.FixedCost {
	var costs []models.FixedCost
	r.DB.Where("user_id = ?", userID).Find(&costs)

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

func (r *GormRepository) SaveFixedObject(cost *models.FixedCost) {
	if cost.ID == 0 {
		r.DB.Create(cost)
	} else {
		r.DB.Save(cost)
	}
}

func (r *GormRepository) DeleteFixedCost(id int, userID uint) {
	r.DB.Where("user_id = ?", userID).Delete(&models.FixedCost{}, id)
}
