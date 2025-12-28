package api

import (
	"testing"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/overview/model"
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/storage"
)

func TestSurplusStatisticsStructure(t *testing.T) {
	stats := model.SurplusStatistics{
		CurrentSurplus:  1000.50,
		MonthlyIncome:   2000.00,
		MonthlyExpenses: 999.50,
		History: []model.SurplusPoint{
			{Month: "2023-01", Surplus: 500, Projected: false},
		},
	}

	if stats.CurrentSurplus != 1000.50 {
		t.Errorf("Expected 1000.50, got %f", stats.CurrentSurplus)
	}
}

func TestCalculateSurplusStatistics(t *testing.T) {
	var workspaceID uint = 1

	mockRepo := &storage.MockRepository{
		FixedCosts: []cost.FixedCost{
			{
				UserID:      1,
				WorkspaceID: workspaceID,
				Name:        "Salary",
				Amount:      3000,
				DueMonth:    []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12},
			},
			{
				UserID:      1,
				WorkspaceID: workspaceID,
				Name:        "Rent",
				Amount:      -1000,
				DueMonth:    []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12},
			},
			{
				UserID:      1,
				WorkspaceID: workspaceID,
				Name:        "Insurance",
				Amount:      -1200, // Yearly
				DueMonth:    []int{1},
			},
		},
	}

	handler := &Handler{Repo: mockRepo, CostRepo: mockRepo}
	current := &types.YearMonth{Year: 2023, Month: 6}
	stats := handler.CalculateSurplusStatistics(current, workspaceID)

	expectedIncome := 3000.0
	// Rent (1000) + Insurance (1200/12 = 100) = 1100
	expectedExpenses := 1100.0
	expectedSurplus := 1900.0

	if stats.MonthlyIncome != expectedIncome {
		t.Errorf("Expected Income %f, got %f", expectedIncome, stats.MonthlyIncome)
	}
	if stats.MonthlyExpenses != expectedExpenses {
		t.Errorf("Expected Expenses %f, got %f", expectedExpenses, stats.MonthlyExpenses)
	}
	if stats.CurrentSurplus != expectedSurplus {
		t.Errorf("Expected Surplus %f, got %f", expectedSurplus, stats.CurrentSurplus)
	}
}

func TestCalculateSurplusHistory(t *testing.T) {
	var workspaceID uint = 1

	// Rent changes from 1000 to 1200 in April
	rentOld := cost.FixedCost{
		UserID:      1,
		WorkspaceID: workspaceID,
		Name:        "Rent Old",
		Amount:      -1000,
		From:        &types.YearMonth{Year: 2023, Month: 1},
		To:          &types.YearMonth{Year: 2023, Month: 3},
		DueMonth:    []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12},
	}
	rentNew := cost.FixedCost{
		UserID:      1,
		WorkspaceID: workspaceID,
		Name:        "Rent New",
		Amount:      -1200,
		From:        &types.YearMonth{Year: 2023, Month: 4},
		To:          nil,
		DueMonth:    []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12},
	}
	salary := cost.FixedCost{
		UserID:      1,
		WorkspaceID: workspaceID,
		Name:        "Salary",
		Amount:      3000,
		From:        nil,
		To:          nil,
		DueMonth:    []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12},
	}

	mockRepo := &storage.MockRepository{
		FixedCosts: []cost.FixedCost{salary, rentOld, rentNew},
	}

	handler := &Handler{Repo: mockRepo, CostRepo: mockRepo}
	current := &types.YearMonth{Year: 2023, Month: 6} // June
	stats := handler.CalculateSurplusStatistics(current, workspaceID)

	if len(stats.History) != 6 {
		t.Errorf("Expected 6 history points, got %d", len(stats.History))
	}

	// Check Jan (Index 0) - Rent 1000
	// Surplus = 3000 - 1000 = 2000
	if len(stats.History) > 0 {
		if stats.History[0].Surplus != 2000 {
			t.Errorf("Jan: Expected surplus 2000, got %f", stats.History[0].Surplus)
		}
		if stats.History[0].Month != "2023-01" {
			t.Errorf("Jan: Expected month 2023-01, got %s", stats.History[0].Month)
		}
	}

	// Check Apr (Index 3) - Rent 1200
	// Surplus = 3000 - 1200 = 1800
	if len(stats.History) > 3 {
		if stats.History[3].Surplus != 1800 {
			t.Errorf("Apr: Expected surplus 1800, got %f", stats.History[3].Surplus)
		}
		if stats.History[3].Month != "2023-04" {
			t.Errorf("Apr: Expected month 2023-04, got %s", stats.History[3].Month)
		}
	}
}