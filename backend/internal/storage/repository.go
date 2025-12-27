package storage

import (
	"wondee/finance-app-backend/internal/models"

	"gorm.io/gorm"
)

// Repository defines the interface for data access
type Repository interface {
	UserRepository
	WealthProfileRepository
	WorkspaceRepository
	InviteRepository
	LoadFixedCosts(workspaceID uint) *[]models.FixedCost
	LoadFixedCostsByUser(userID uint) *[]models.FixedCost
	SaveFixedObject(cost *models.FixedCost)
	DeleteFixedCost(id int, workspaceID uint)

	LoadSpecialCosts(workspaceID uint) *[]models.SpecialCost
	LoadSpecialCostsByUser(userID uint) *[]models.SpecialCost
	SaveSpecialCost(cost *models.SpecialCost)
	DeleteSpecialCost(id int, workspaceID uint)
}

// GormRepository implements Repository using GORM
type GormRepository struct {
	DB *gorm.DB
}
