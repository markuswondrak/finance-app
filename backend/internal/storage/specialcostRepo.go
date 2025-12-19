package storage

import (
	"wondee/finance-app-backend/internal/models"
)

func (r *GormRepository) LoadSpecialCosts(userID uint) *[]models.SpecialCost {
	var specialCosts []models.SpecialCost
	r.DB.Where("user_id = ?", userID).Find(&specialCosts)
	return &specialCosts
}

func (r *GormRepository) SaveSpecialCost(cost *models.SpecialCost) {
	if cost.ID == 0 {
		r.DB.Create(cost)
	} else {
		r.DB.Save(cost)
	}
}

func (r *GormRepository) DeleteSpecialCost(id int, userID uint) {
	r.DB.Where("user_id = ?", userID).Delete(&models.SpecialCost{}, id)
}
