package storage

import (
	"wondee/finance-app-backend/internal/workspace"
)

type InviteRepository interface {
	CreateInvite(invite *workspace.Invite) error
	GetInviteByToken(token string) (*workspace.Invite, error)
	UpdateInvite(invite *workspace.Invite) error
	DeleteInvite(token string) error
}

func (r *GormRepository) CreateInvite(invite *workspace.Invite) error {
	return r.DB.Create(invite).Error
}

func (r *GormRepository) GetInviteByToken(token string) (*workspace.Invite, error) {
	var invite workspace.Invite
	err := r.DB.Where("token = ? AND is_used = ?", token, false).First(&invite).Error
	if err != nil {
		return nil, err
	}
	return &invite, nil
}

func (r *GormRepository) UpdateInvite(invite *workspace.Invite) error {
	return r.DB.Save(invite).Error
}

func (r *GormRepository) DeleteInvite(token string) error {
	return r.DB.Where("token = ?", token).Delete(&workspace.Invite{}).Error
}
