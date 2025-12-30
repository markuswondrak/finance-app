package storage

import (
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/user"
	"wondee/finance-app-backend/internal/wealth"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetUser() (*user.User, error)
	UpdateUserCurrentAmount(amount int) error
	Create(user *user.User) error
	GetByEmail(email string) (*user.User, error)
	GetByID(id uint) (*user.User, error)
	Update(user *user.User) error
	Delete(id uint) error
	PurgeUserData(userID uint) error
	UpdateOnboardingStatus(userID uint, completed bool) (*user.User, error)
}

func (r *GormRepository) PurgeUserData(userID uint) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("user_id = ?", userID).Delete(&cost.FixedCost{}).Error; err != nil {
			return err
		}
		if err := tx.Where("user_id = ?", userID).Delete(&cost.SpecialCost{}).Error; err != nil {
			return err
		}
		if err := tx.Where("user_id = ?", userID).Delete(&wealth.WealthProfile{}).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *GormRepository) GetUser() (*user.User, error) {
	var user user.User
	// Legacy method for single-user mode, returns first user
	result := r.DB.First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (r *GormRepository) UpdateUserCurrentAmount(amount int) error {
	var user user.User
	// Legacy method for single-user mode, updates first user
	if err := r.DB.First(&user).Error; err != nil {
		return err
	}
	
	// Update the CurrentAmount column
	return r.DB.Model(&user).Update("current_amount", amount).Error
}

func (r *GormRepository) Create(user *user.User) error {
	return r.DB.Create(user).Error
}

func (r *GormRepository) GetByEmail(email string) (*user.User, error) {
	var user user.User
	err := r.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormRepository) GetByID(id uint) (*user.User, error) {
	var user user.User
	err := r.DB.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormRepository) Update(user *user.User) error {
	return r.DB.Save(user).Error
}

func (r *GormRepository) Delete(id uint) error {
	// GORM will handle cascading deletes if configured in models,
	// or we can manually delete related data if needed.
	// wealth.WealthProfile has OnDelete:CASCADE on UserID.
	// FixedCost and SpecialCost also need to be checked.

	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Delete related records that might not have CASCADE set up in DB
		if err := tx.Where("user_id = ?", id).Delete(&cost.FixedCost{}).Error; err != nil {
			return err
		}
		if err := tx.Where("user_id = ?", id).Delete(&cost.SpecialCost{}).Error; err != nil {
			return err
		}
		if err := tx.Where("user_id = ?", id).Delete(&wealth.WealthProfile{}).Error; err != nil {
			return err
		}

		// Finally delete the user
		return tx.Delete(&user.User{}, id).Error
	})
}

func (r *GormRepository) UpdateOnboardingStatus(userID uint, completed bool) (*user.User, error) {
	var u user.User
	if err := r.DB.First(&u, userID).Error; err != nil {
		return nil, err
	}

	u.OnboardingCompleted = completed
	if err := r.DB.Save(&u).Error; err != nil {
		return nil, err
	}

	return &u, nil
}
