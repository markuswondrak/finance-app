package storage

import (
	"wondee/finance-app-backend/internal/workspace"
)

type WorkspaceRepository interface {
	CreateWorkspace(ws *workspace.Workspace) error
	GetWorkspaceByID(id uint) (*workspace.Workspace, error)
	UpdateWorkspace(ws *workspace.Workspace) error
	UpdateWorkspaceCurrentAmount(workspaceID uint, amount int) error
}

func (r *GormRepository) CreateWorkspace(ws *workspace.Workspace) error {
	return r.DB.Create(ws).Error
}

func (r *GormRepository) GetWorkspaceByID(id uint) (*workspace.Workspace, error) {
	var ws workspace.Workspace
	err := r.DB.Preload("Users").First(&ws, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &ws, nil
}

func (r *GormRepository) UpdateWorkspace(ws *workspace.Workspace) error {
	return r.DB.Save(ws).Error
}

func (r *GormRepository) UpdateWorkspaceCurrentAmount(workspaceID uint, amount int) error {
	return r.DB.Model(&workspace.Workspace{}).Where("id = ?", workspaceID).Update("current_amount", amount).Error
}
