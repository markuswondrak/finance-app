package api

import (
	"testing"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/storage"
)

func TestToDBSpecialCost(t *testing.T) {
	// Valid Expense
	expense := &JsonSpecialCost{Amount: -100, IsSaving: false}
	_, err := ToDBSpecialCost(expense)
	if err != nil {
		t.Errorf("Unexpected error for expense: %v", err)
	}

	// Valid Saving
	saving := &JsonSpecialCost{Amount: -100, IsSaving: true}
	_, err = ToDBSpecialCost(saving)
	if err != nil {
		t.Errorf("Unexpected error for saving: %v", err)
	}

	// Valid Income
	income := &JsonSpecialCost{Amount: 100, IsSaving: false}
	_, err = ToDBSpecialCost(income)
	if err != nil {
		t.Errorf("Unexpected error for income: %v", err)
	}

	// Valid: Income + Saving (Wealth Extraction)
	validExtraction := &JsonSpecialCost{Amount: 100, IsSaving: true}
	_, err = ToDBSpecialCost(validExtraction)
	if err != nil {
		t.Errorf("Unexpected error for Wealth Extraction: %v", err)
	}
}

func TestCreateSpecialCosts(t *testing.T) {
	var workspaceID uint = 1

	mockRepo := &storage.MockRepository{
		SpecialCosts: []cost.SpecialCost{
			{ID: 1, UserID: 1, WorkspaceID: workspaceID, Name: "S1", Amount: 100, DueDate: &types.YearMonth{Year: 2023, Month: 1}},
			{ID: 2, UserID: 1, WorkspaceID: workspaceID, Name: "S2", Amount: 200, DueDate: &types.YearMonth{Year: 2023, Month: 2}},
			{ID: 3, UserID: 2, WorkspaceID: 2, Name: "S3", Amount: 300, DueDate: &types.YearMonth{Year: 2023, Month: 3}},
		},
	}
	handler := &SpecialCostHandler{Repo: mockRepo}

	result := handler.createSpecialCosts(workspaceID)

	if len(result) != 2 {
		t.Errorf("Expected 2 special costs, got %d", len(result))
	}
	if result[0].Name != "S1" {
		t.Errorf("Expected first cost name S1, got %s", result[0].Name)
	}
}