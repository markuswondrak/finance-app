package api

import (
	"testing"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/storage"
	"wondee/finance-app-backend/internal/workspace"
)

func TestCreateOverview(t *testing.T) {
	var workspaceID uint = 1

	mockRepo := &storage.MockRepository{
		Workspaces: []workspace.Workspace{
			{
				ID:            workspaceID,
				Name:          "Test Workspace",
				CurrentAmount: 1234,
			},
		},
		FixedCosts:   []cost.FixedCost{},
		SpecialCosts: []cost.SpecialCost{},
	}
	handler := &Handler{Repo: mockRepo, CostRepo: mockRepo}

	overview := handler.createOverview(workspaceID)

	if overview.CurrentAmount != 1234 {
		t.Errorf("Expected CurrentAmount 1234, got %d", overview.CurrentAmount)
	}
}

func TestCreateOverviewDetail(t *testing.T) {
	var workspaceID uint = 1
	dueDate := types.CurrentYearMonth()

	mockRepo := &storage.MockRepository{
		FixedCosts: []cost.FixedCost{
			{
				ID:          10,
				UserID:      1,
				WorkspaceID: workspaceID,
				Name:        "Rent",
				Amount:      -500,
				DueMonth:    []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12},
			},
		},
		SpecialCosts: []cost.SpecialCost{
			{
				ID:          20,
				UserID:      1,
				WorkspaceID: workspaceID,
				Name:        "Car",
				Amount:      -1000,
				DueDate:     dueDate,
			},
		},
	}
	handler := &Handler{Repo: mockRepo, CostRepo: mockRepo}

	detail := handler.createOverviewDetail(0, workspaceID)

	foundSpecial := false
	for _, c := range detail.SpecialCosts {
		if c.ID == 20 {
			foundSpecial = true
			break
		}
	}
	if !foundSpecial {
		t.Error("Special cost ID not found in detail")
	}

	foundFixed := false
	for _, c := range detail.FixedCosts {
		if c.ID == 10 {
			foundFixed = true
			break
		}
	}
	if !foundFixed {
		t.Error("Fixed cost ID not found in detail")
	}
}