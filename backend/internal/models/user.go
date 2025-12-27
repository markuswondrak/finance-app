package models

import (
	"time"
)

type User struct {
	ID            uint   `json:"id" gorm:"primaryKey"`
	GoogleID      string `json:"google_id" gorm:"unique"`
	Email         string `json:"email" gorm:"unique"`
	Name          string `json:"name"`
	AvatarURL     string `json:"avatar_url"`
	CurrentAmount int    `json:"current_amount"` // Legacy field for single-user mode, or reused
	WorkspaceID   uint   `json:"workspace_id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
