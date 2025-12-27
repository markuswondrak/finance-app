package models

import (
	"time"
)

type Invite struct {
	ID          uint      `gorm:"primaryKey"`
	Token       string    `gorm:"uniqueIndex;not null"`
	WorkspaceID uint      `gorm:"not null"`
	InvitedBy   uint      `gorm:"not null"` // User ID of the inviter
	Email       string    `gorm:"not null"`
	ExpiresAt   time.Time `gorm:"not null"`
	IsUsed      bool      `gorm:"default:false;not null"`
	CreatedAt   time.Time
}
