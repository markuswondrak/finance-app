package service

import (
	"wondee/finance-app-backend/internal/cost"
	cost_repo "wondee/finance-app-backend/internal/cost/repository"
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/spend"
	"wondee/finance-app-backend/internal/spend/repository"
)

// SpendService provides business logic for the save-to-spend feature
type SpendService struct {
	repo     repository.Repository
	costRepo cost_repo.Repository
}

// NewSpendService creates a new SpendService instance
func NewSpendService(repo repository.Repository, costRepo cost_repo.Repository) *SpendService {
	return &SpendService{
		repo:     repo,
		costRepo: costRepo,
	}
}

// EnsureInitialized ensures payment statuses exist for the current month
// If no records exist, it either copies from previous month or creates for all valid fixed costs
func (s *SpendService) EnsureInitialized(workspaceID uint, month types.YearMonth) error {
	// Check if any records exist for this month
	count, err := s.repo.CountPaymentStatuses(workspaceID, month)
	if err != nil {
		return err
	}

	if count > 0 {
		return nil // Already initialized
	}

	// Try to copy from previous month
	prevMonth := types.AddMonths(&month, -1)
	prevStatuses, err := s.repo.GetPaymentStatuses(workspaceID, *prevMonth)
	if err != nil {
		return err
	}

	if len(prevStatuses) > 0 {
		// Copy selections from previous month (reset IsPaid to false)
		for _, status := range prevStatuses {
			newStatus := &spend.MonthlyPaymentStatus{
				WorkspaceID: workspaceID,
				FixedCostID: status.FixedCostID,
				Month:       month,
				IsPaid:      false,
			}
			if err := s.repo.CreatePaymentStatus(newStatus); err != nil {
				return err
			}
		}
		return nil
	}

	// First time ever: include all valid fixed costs
	fixedCosts := s.costRepo.LoadFixedCosts(workspaceID)
	for _, fc := range *fixedCosts {
		if s.isValidForMonth(&fc, &month) {
			newStatus := &spend.MonthlyPaymentStatus{
				WorkspaceID: workspaceID,
				FixedCostID: fc.ID,
				Month:       month,
				IsPaid:      false,
			}
			if err := s.repo.CreatePaymentStatus(newStatus); err != nil {
				return err
			}
		}
	}

	return nil
}

// isValidForMonth checks if a fixed cost is valid for a given month
func (s *SpendService) isValidForMonth(fc *cost.FixedCost, month *types.YearMonth) bool {
	// Check validity period
	if !types.IsRelevant(month, fc.From, fc.To) {
		return false
	}
	// Check billing cycle - DueMonth contains the months when this cost is due
	return s.containsMonth(fc.DueMonth, month.Month)
}

// containsMonth checks if the dueMonths slice contains the given month
func (s *SpendService) containsMonth(dueMonths []int, month int) bool {
	for _, m := range dueMonths {
		if m == month {
			return true
		}
	}
	return false
}

// CalculateSafeToSpend calculates the safe-to-spend amount for a workspace
func (s *SpendService) CalculateSafeToSpend(workspaceID uint, month types.YearMonth) (int, error) {
	// Get workspace to get the checking balance
	workspace, err := s.repo.GetWorkspace(workspaceID)
	if err != nil {
		return 0, err
	}

	// Get payment statuses for current month
	statuses, err := s.repo.GetPaymentStatuses(workspaceID, month)
	if err != nil {
		return 0, err
	}

	// Build a map of fixed cost IDs to their paid status
	paidMap := make(map[int]bool)
	for _, status := range statuses {
		paidMap[status.FixedCostID] = status.IsPaid
	}

	// Load fixed costs to get amounts
	fixedCosts := s.costRepo.LoadFixedCosts(workspaceID)

	// Sum pending fixed costs (included AND not paid)
	// Amounts are signed: negative = expense, positive = income
	pendingFixedCostsTotal := 0
	for _, status := range statuses {
		if !status.IsPaid {
			// Find the cost amount
			for _, fc := range *fixedCosts {
				if fc.ID == status.FixedCostID {
					pendingFixedCostsTotal += fc.Amount
					break
				}
			}
		}
	}

	// Get one-time costs for current month
	oneTimeCosts, err := s.repo.GetOneTimeCosts(workspaceID, month)
	if err != nil {
		return 0, err
	}

	// Sum unpaid one-time costs (signed amounts)
	unpaidOneTimeTotal := 0
	for _, otc := range oneTimeCosts {
		if !otc.IsPaid {
			unpaidOneTimeTotal += otc.Amount
		}
	}

	// Add pending amounts (negative expenses reduce balance, positive income increases it)
	return workspace.SaveToSpendBalance + pendingFixedCostsTotal + unpaidOneTimeTotal, nil
}

// GetPendingTotal calculates the total pending amount (signed: negative = expenses, positive = income)
func (s *SpendService) GetPendingTotal(workspaceID uint, month types.YearMonth) (int, error) {
	// Get payment statuses for current month
	statuses, err := s.repo.GetPaymentStatuses(workspaceID, month)
	if err != nil {
		return 0, err
	}

	// Load fixed costs to get amounts
	fixedCosts := s.costRepo.LoadFixedCosts(workspaceID)

	// Sum pending fixed costs (signed amounts)
	pendingFixedCostsTotal := 0
	for _, status := range statuses {
		if !status.IsPaid {
			for _, fc := range *fixedCosts {
				if fc.ID == status.FixedCostID {
					pendingFixedCostsTotal += fc.Amount
					break
				}
			}
		}
	}

	// Get one-time costs for current month
	oneTimeCosts, err := s.repo.GetOneTimeCosts(workspaceID, month)
	if err != nil {
		return 0, err
	}

	// Sum unpaid one-time costs (signed amounts)
	unpaidOneTimeTotal := 0
	for _, otc := range oneTimeCosts {
		if !otc.IsPaid {
			unpaidOneTimeTotal += otc.Amount
		}
	}

	return pendingFixedCostsTotal + unpaidOneTimeTotal, nil
}
