package service

import (
	cost_repo "wondee/finance-app-backend/internal/cost/repository"
)

type UserService struct {
	CostRepo cost_repo.Repository
}

func NewUserService(costRepo cost_repo.Repository) *UserService {
	return &UserService{CostRepo: costRepo}
}

func (s *UserService) HasExistingData(userID uint) (bool, error) {
	// Check Fixed Costs
	costs := s.CostRepo.LoadFixedCostsByUser(userID)
	if costs != nil && len(*costs) > 0 {
		return true, nil
	}

	// Check Special Costs
	specials := s.CostRepo.LoadSpecialCostsByUser(userID)
	if specials != nil && len(*specials) > 0 {
		return true, nil
	}

	return false, nil
}
