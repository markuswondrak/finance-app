package storage

import (
	"wondee/finance-app-backend/internal/models"
)

func (r *GormRepository) LoadFixedCosts() *[]models.FixedCost {
	var costs []models.FixedCost
	r.DB.Find(&costs)
	return &costs
}

func (r *GormRepository) SaveFixedObject(cost *models.FixedCost) {
	if cost.ID == 0 {
		r.DB.Create(cost)
	} else {
		r.DB.Save(cost)
	}
}

func (r *GormRepository) DeleteFixedCost(id int) {
	r.DB.Delete(&models.FixedCost{}, id)
}
