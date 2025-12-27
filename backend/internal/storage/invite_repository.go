package storage

import (
	"wondee/finance-app-backend/internal/models"
)

type InviteRepository interface {
	CreateInvite(invite *models.Invite) error
	GetInviteByToken(token string) (*models.Invite, error)
	UpdateInvite(invite *models.Invite) error
	DeleteInvite(token string) error
}

func (r *GormRepository) CreateInvite(invite *models.Invite) error {
	return r.DB.Create(invite).Error
}

func (r *GormRepository) GetInviteByToken(token string) (*models.Invite, error) {
	var invite models.Invite
	err := r.DB.Where("token = ? AND is_used = ?", token, false).First(&invite).Error
	if err != nil {
		return nil, err
	}
	return &invite, nil
}

func (r *GormRepository) UpdateInvite(invite *models.Invite) error {
	return r.DB.Save(invite).Error
}

func (r *GormRepository) DeleteInvite(token string) error {
	return r.DB.Where("token = ?", token).Delete(&models.Invite{}).Error
}
