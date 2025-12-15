package storage

import (
	"wondee/finance-app-backend/internal/models"
)

type UserRepository interface {
	GetUser() (*models.User, error)
	UpdateUserCurrentAmount(amount int) error
}

func (r *GormRepository) GetUser() (*models.User, error) {
	var user models.User
	// FirstOrCreate ensures we always have a user record.
	// Since there's only one user, we don't need conditions.
	result := r.DB.FirstOrCreate(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (r *GormRepository) UpdateUserCurrentAmount(amount int) error {
	var user models.User
	// Ensure user exists
	if err := r.DB.FirstOrCreate(&user).Error; err != nil {
		return err
	}
	
	// Update the CurrentAmount column
	return r.DB.Model(&user).Update("current_amount", amount).Error
}
