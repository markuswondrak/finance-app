package workspace

import (
	"time"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/user"
)

type Workspace struct {
	ID            uint   `gorm:"primaryKey"`
	Name          string `gorm:"not null"`
	CurrentAmount int    `gorm:"default:0"`
	CreatedAt     time.Time
	UpdatedAt     time.Time

	// Relationships
	Users      []user.User      `gorm:"foreignKey:WorkspaceID"`
	FixedCosts []cost.FixedCost `gorm:"foreignKey:WorkspaceID"`
	Invites    []Invite         `gorm:"foreignKey:WorkspaceID"`
}
