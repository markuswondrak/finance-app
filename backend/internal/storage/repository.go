package storage

import (
	"wondee/finance-app-backend/internal/models"
	"gorm.io/gorm"
)

// Repository defines the interface for data access
type Repository interface {
	UserRepository
	LoadFixedCosts(userID uint) *[]models.FixedCost
	SaveFixedObject(cost *models.FixedCost)
	DeleteFixedCost(id int, userID uint)

	LoadSpecialCosts(userID uint) *[]models.SpecialCost
	SaveSpecialCost(cost *models.SpecialCost)
	DeleteSpecialCost(id int, userID uint)
}

// GormRepository implements Repository using GORM
type GormRepository struct {
	DB *gorm.DB
}
