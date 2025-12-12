package api

import (
	"testing"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
)

func TestToJsonStruct(t *testing.T) {
	fc := &models.FixedCost{
		ID:       1,
		Name:     "Test",
		Amount:   100,
		From:     &models.YearMonth{Year: 2023, Month: 1},
		To:       &models.YearMonth{Year: 2023, Month: 12},
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
		From:     &models.YearMonth{Year: 2023, Month: 1},
		To:       &models.YearMonth{Year: 2023, Month: 12},
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
}

func TestCreateFixedCosts(t *testing.T) {
	mockRepo := &storage.MockRepository{
		FixedCosts: []models.FixedCost{
			{ID: 1, Name: "M1", Amount: 10, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}, From: &models.YearMonth{Year: 2000, Month: 1}}, // Monthly
			{ID: 2, Name: "Q1", Amount: 20, DueMonth: []int{1, 4, 7, 10}, From: &models.YearMonth{Year: 2000, Month: 1}},                       // Quarterly
			{ID: 3, Name: "H1", Amount: 30, DueMonth: []int{1, 7}, From: &models.YearMonth{Year: 2000, Month: 1}},                              // HalfYearly
			{ID: 4, Name: "Y1", Amount: 40, DueMonth: []int{1}, From: &models.YearMonth{Year: 2000, Month: 1}},                                 // Yearly
		},
	}
	server := NewServer(mockRepo)

	resp := server.createFixedCosts()

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
