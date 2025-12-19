package storage

import (
	"wondee/finance-app-backend/internal/models"
)

func (r *GormRepository) LoadFixedCosts(userID uint) *[]models.FixedCost {
	var costs []models.FixedCost
	r.DB.Where("user_id = ?", userID).Find(&costs)
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
