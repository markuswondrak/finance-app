package service

import (
	"fmt"
	"wondee/finance-app-backend/internal/storage"
	"wondee/finance-app-backend/internal/workspace"
)

type WorkspaceService struct {
	Repo storage.Repository
}

func NewWorkspaceService(repo storage.Repository) *WorkspaceService {
	return &WorkspaceService{Repo: repo}
}

func (s *WorkspaceService) GetWorkspace(id uint) (*workspace.Workspace, error) {
	return s.Repo.GetWorkspaceByID(id)
}

func (s *WorkspaceService) UpdateWorkspaceName(id uint, name string) (*workspace.Workspace, error) {
	workspace, err := s.Repo.GetWorkspaceByID(id)
	if err != nil {
		return nil, err
	}

	workspace.Name = name
	if err := s.Repo.UpdateWorkspace(workspace); err != nil {
		return nil, err
	}

	return workspace, nil
}

func (s *WorkspaceService) PurgeUserData(userID uint) error {
	return s.Repo.PurgeUserData(userID)
}

func (s *WorkspaceService) RemoveMember(memberID uint, workspaceID uint, requestingUserID uint) error {
	// 1. Get Member
	member, err := s.Repo.GetByID(memberID)
	if err != nil {
		return err
	}

	// 2. Verify Member is in Workspace
	if member.WorkspaceID != workspaceID {
		return fmt.Errorf("member not in workspace")
	}

	// 3. Create new workspace for removed member
	newWorkspace := &workspace.Workspace{
		Name: fmt.Sprintf("%s's Workspace", member.Name),
	}
	if err := s.Repo.CreateWorkspace(newWorkspace); err != nil {
		return err
	}

	// 4. Update Member
	member.WorkspaceID = newWorkspace.ID
	if err := s.Repo.Update(member); err != nil {
		return err
	}

	// 5. Optionally create default wealth profile for new workspace
	// Not mandatory for MVP, but good practice.
	// We rely on Auth Callback or next wealth access to potentially handle defaults if missing.
	// But Auth Callback only does it on Login if profile missing.
	// WealthProfileService.GetProfile returns defaults if missing.
	// So it should be fine.

	return nil
}
