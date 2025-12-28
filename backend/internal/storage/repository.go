package storage

import (
	"gorm.io/gorm"
)

// Repository defines the interface for data access
type Repository interface {
	UserRepository
	WealthProfileRepository
	WorkspaceRepository
	InviteRepository
}

// GormRepository implements Repository using GORM
type GormRepository struct {
	DB *gorm.DB
}
