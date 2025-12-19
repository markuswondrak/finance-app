package models

import (
	"time"
)

type User struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	GoogleID      string    `json:"google_id" gorm:"unique;not null"`
	Email         string    `json:"email" gorm:"unique;not null"`
	Name          string    `json:"name"`
	AvatarURL     string    `json:"avatar_url"`
	CurrentAmount int       `json:"current_amount"` // Legacy field for single-user mode, or reused
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
