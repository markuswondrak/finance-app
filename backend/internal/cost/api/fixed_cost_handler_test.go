package api

import (
	"testing"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/storage"
)

// TODO: Create MockCostRepository in cost/repository/mock.go for better testing
// For now, reusing storage.MockRepository but we need to cast or adapt if interfaces diverge
// Actually, storage.MockRepository implements the methods, but FixedCostHandler expects repository.Repository
// storage.MockRepository needs to implement cost_repo.Repository.
// Since the signatures are identical, it should implicitly implement it.


func TestToJsonStruct(t *testing.T) {
	fc := &cost.FixedCost{
		ID:       1,
		Name:     "Test",
		Amount:   100,
		From:     &types.YearMonth{Year: 2023, Month: 1},
		To:       &types.YearMonth{Year: 2023, Month: 12},
		DueMonth: []int{1},
	}

	jsonFC := ToJsonStruct(fc)
	if jsonFC.ID != 1 || jsonFC.Name != "Test" || jsonFC.Amount != 100 {
		t.Error("Mapping mismatch")
	}
	if jsonFC.DueMonth != 1 {
		t.Error("Expected DueMonth 1")
	}
}

func TestToDBStruct(t *testing.T) {
	jsonFC := &JsonFixedCost{
		ID:       1,
		Name:     "Test",
		Amount:   100,
		From:     &types.YearMonth{Year: 2023, Month: 1},
		To:       &types.YearMonth{Year: 2023, Month: 12},
		DueMonth: 1,
	}

	converter := func(m int) ([]int, error) {
		return []int{m}, nil
	}

	fc, err := ToDBStruct(jsonFC, converter)
	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}
	if fc.ID != 1 || fc.DueMonth[0] != 1 {
		t.Error("Mapping mismatch")
	}

	// Test Validation: Incoming + Saving = Wealth Extraction (Now Valid)
	validWealthExtraction := &JsonFixedCost{
		Amount:   100, // Positive = Incoming
		IsSaving: true,
	}
	_, err = ToDBStruct(validWealthExtraction, converter)
	if err != nil {
		t.Errorf("Expected success for Wealth Extraction, got error: %v", err)
	}
}

func TestCreateFixedCosts(t *testing.T) {
	var workspaceID uint = 1

	mockRepo := &storage.MockRepository{
		FixedCosts: []cost.FixedCost{
			{ID: 1, UserID: 1, WorkspaceID: workspaceID, Name: "M1", Amount: 10, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}, From: &types.YearMonth{Year: 2000, Month: 1}}, // Monthly
			{ID: 2, UserID: 1, WorkspaceID: workspaceID, Name: "Q1", Amount: 20, DueMonth: []int{1, 4, 7, 10}, From: &types.YearMonth{Year: 2000, Month: 1}},                          // Quarterly
			{ID: 3, UserID: 1, WorkspaceID: workspaceID, Name: "H1", Amount: 30, DueMonth: []int{1, 7}, From: &types.YearMonth{Year: 2000, Month: 1}},                                 // HalfYearly
			{ID: 4, UserID: 1, WorkspaceID: workspaceID, Name: "Y1", Amount: 40, DueMonth: []int{1}, From: &types.YearMonth{Year: 2000, Month: 1}},                                    // Yearly
			{ID: 5, UserID: 2, WorkspaceID: 2, Name: "M2", Amount: 50, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}, From: &types.YearMonth{Year: 2000, Month: 1}},           // Another workspace
		},
	}
	handler := &FixedCostHandler{Repo: mockRepo}

	resp := handler.createFixedCosts(workspaceID)

	if len(resp.Monthly) != 1 {
		t.Errorf("Expected 1 monthly cost, got %d", len(resp.Monthly))
	}
	if len(resp.Quarterly) != 1 {
		t.Errorf("Expected 1 quarterly cost, got %d", len(resp.Quarterly))
	}
	if len(resp.Halfyearly) != 1 {
		t.Errorf("Expected 1 halfyearly cost, got %d", len(resp.Halfyearly))
	}
	if len(resp.Yearly) != 1 {
		t.Errorf("Expected 1 yearly cost, got %d", len(resp.Yearly))
	}
}