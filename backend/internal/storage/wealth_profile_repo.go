package storage

import (
	"wondee/finance-app-backend/internal/models"
	"gorm.io/gorm"
)

type WealthProfileRepository interface {
	GetWealthProfile(userID uint) (*models.WealthProfile, error)
	UpsertWealthProfile(profile *models.WealthProfile) error
}

func (r *GormRepository) GetWealthProfile(userID uint) (*models.WealthProfile, error) {
	var profile models.WealthProfile
	err := r.DB.Where("user_id = ?", userID).First(&profile).Error
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

func (r *GormRepository) UpsertWealthProfile(profile *models.WealthProfile) error {
	var existing models.WealthProfile
	err := r.DB.Where("user_id = ?", profile.UserID).First(&existing).Error
	
	if err == nil {
		// Update existing profile
		profile.ID = existing.ID
		profile.CreatedAt = existing.CreatedAt
		return r.DB.Save(profile).Error
	} else if err == gorm.ErrRecordNotFound {
		// Create new profile
		return r.DB.Create(profile).Error
	}
	
	return err
}
