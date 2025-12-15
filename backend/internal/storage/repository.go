package storage

import (
	"wondee/finance-app-backend/internal/models"
	"gorm.io/gorm"
)

// Repository defines the interface for data access
type Repository interface {
	UserRepository
	LoadFixedCosts() *[]models.FixedCost
	SaveFixedObject(cost *models.FixedCost)
	DeleteFixedCost(id int)

	LoadSpecialCosts() *[]models.SpecialCost
	SaveSpecialCost(cost *models.SpecialCost)
	DeleteSpecialCost(id int)
}

// GormRepository implements Repository using GORM
type GormRepository struct {
	DB *gorm.DB
}
