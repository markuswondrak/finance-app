package services

import (
	"wondee/finance-app-backend/internal/storage"
)

type UserService struct {
	Repo storage.Repository
}

func NewUserService(repo storage.Repository) *UserService {
	return &UserService{Repo: repo}
}

func (s *UserService) HasExistingData(userID uint) (bool, error) {
	// Check Fixed Costs
	costs := s.Repo.LoadFixedCostsByUser(userID)
	if costs != nil && len(*costs) > 0 {
		return true, nil
	}

	// Check Special Costs
	specials := s.Repo.LoadSpecialCostsByUser(userID)
	if specials != nil && len(*specials) > 0 {
		return true, nil
	}

	return false, nil
}
