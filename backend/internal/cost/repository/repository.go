package repository

import (
	"wondee/finance-app-backend/internal/cost"
	"gorm.io/gorm"
)

type Repository interface {
	LoadFixedCosts(workspaceID uint) *[]cost.FixedCost
	LoadFixedCostsByUser(userID uint) *[]cost.FixedCost
	SaveFixedObject(cost *cost.FixedCost)
	DeleteFixedCost(id int, workspaceID uint)

	LoadSpecialCosts(workspaceID uint) *[]cost.SpecialCost
	LoadSpecialCostsByUser(userID uint) *[]cost.SpecialCost
	SaveSpecialCost(cost *cost.SpecialCost)
	DeleteSpecialCost(id int, workspaceID uint)
}

type PostgresRepository struct {
	DB *gorm.DB
}
