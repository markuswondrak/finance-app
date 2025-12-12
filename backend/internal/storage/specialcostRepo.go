package storage

import (
	"wondee/finance-app-backend/internal/models"
)

func (r *GormRepository) LoadSpecialCosts() *[]models.SpecialCost {
	var specialCosts []models.SpecialCost
	r.DB.Find(&specialCosts)
	return &specialCosts
}

func (r *GormRepository) SaveSpecialCost(cost *models.SpecialCost) {
	if cost.ID == 0 {
		r.DB.Create(cost)
	} else {
		r.DB.Save(cost)
	}
}

func (r *GormRepository) DeleteSpecialCost(id int) {
	r.DB.Delete(&models.SpecialCost{}, id)
}
