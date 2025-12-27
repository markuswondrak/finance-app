package storage

import (
	"wondee/finance-app-backend/internal/models"
)

type WorkspaceRepository interface {
	CreateWorkspace(workspace *models.Workspace) error
	GetWorkspaceByID(id uint) (*models.Workspace, error)
	UpdateWorkspace(workspace *models.Workspace) error
}

func (r *GormRepository) CreateWorkspace(workspace *models.Workspace) error {
	return r.DB.Create(workspace).Error
}

func (r *GormRepository) GetWorkspaceByID(id uint) (*models.Workspace, error) {
	var workspace models.Workspace
	err := r.DB.Preload("Users").First(&workspace, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &workspace, nil
}

func (r *GormRepository) UpdateWorkspace(workspace *models.Workspace) error {
	return r.DB.Save(workspace).Error
}
