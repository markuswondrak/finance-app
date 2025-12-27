package storage

import (
	"wondee/finance-app-backend/internal/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetUser() (*models.User, error)
	UpdateUserCurrentAmount(amount int) error
	Create(user *models.User) error
	GetByEmail(email string) (*models.User, error)
	GetByID(id uint) (*models.User, error)
	Update(user *models.User) error
	Delete(id uint) error
	PurgeUserData(userID uint) error
}

func (r *GormRepository) PurgeUserData(userID uint) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("user_id = ?", userID).Delete(&models.FixedCost{}).Error; err != nil {
			return err
		}
		if err := tx.Where("user_id = ?", userID).Delete(&models.SpecialCost{}).Error; err != nil {
			return err
		}
		if err := tx.Where("user_id = ?", userID).Delete(&models.WealthProfile{}).Error; err != nil {
			return err
		}
		return nil
	})
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

func (r *GormRepository) Delete(id uint) error {
	// GORM will handle cascading deletes if configured in models, 
	// or we can manually delete related data if needed.
	// models.WealthProfile has OnDelete:CASCADE on UserID.
	// FixedCost and SpecialCost also need to be checked.
	
	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Delete related records that might not have CASCADE set up in DB
		if err := tx.Where("user_id = ?", id).Delete(&models.FixedCost{}).Error; err != nil {
			return err
		}
		if err := tx.Where("user_id = ?", id).Delete(&models.SpecialCost{}).Error; err != nil {
			return err
		}
		if err := tx.Where("user_id = ?", id).Delete(&models.WealthProfile{}).Error; err != nil {
			return err
		}
		
		// Finally delete the user
		return tx.Delete(&models.User{}, id).Error
	})
}
