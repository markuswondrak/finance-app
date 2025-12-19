package storage

import (
	"wondee/finance-app-backend/internal/models"
)

type UserRepository interface {
	GetUser() (*models.User, error)
	UpdateUserCurrentAmount(amount int) error
	Create(user *models.User) error
	GetByEmail(email string) (*models.User, error)
	GetByID(id uint) (*models.User, error)
	Update(user *models.User) error
}

func (r *GormRepository) GetUser() (*models.User, error) {
	var user models.User
	// Legacy method for single-user mode, returns first user
	result := r.DB.First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (r *GormRepository) UpdateUserCurrentAmount(amount int) error {
	var user models.User
	// Legacy method for single-user mode, updates first user
	if err := r.DB.First(&user).Error; err != nil {
		return err
	}
	
	// Update the CurrentAmount column
	return r.DB.Model(&user).Update("current_amount", amount).Error
}

func (r *GormRepository) Create(user *models.User) error {
	return r.DB.Create(user).Error
}

func (r *GormRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormRepository) GetByID(id uint) (*models.User, error) {
	var user models.User
	err := r.DB.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormRepository) Update(user *models.User) error {
	return r.DB.Save(user).Error
}
