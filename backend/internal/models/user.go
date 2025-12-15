package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	CurrentAmount int `gorm:"not null"`
}
