package api

import (
	"testing"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
)

func TestCreateOverview(t *testing.T) {
	mockRepo := &storage.MockRepository{
		FixedCosts: []models.FixedCost{
			{ID: 1, Name: "Monthly", Amount: 100, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}, From: &models.YearMonth{Year: 2000, Month: 1}},
		},
		SpecialCosts: []models.SpecialCost{},
	}
	server := NewServer(mockRepo)

	overview := server.createOverview()

	// Initial amount is 3000. Monthly cost 100.
	// Entry 0: current month. Amount = 3000 + 100 = 3100.

	if overview.CurrentAmount != 3000 {
		t.Errorf("Expected current amount 3000, got %d", overview.CurrentAmount)
	}

	if len(overview.Entries) != MAX_ENTRIES {
		t.Errorf("Expected %d entries, got %d", MAX_ENTRIES, len(overview.Entries))
	}

	// Note: The logic in createOverview adds the costs to the amount.
	// 3000 + 100 = 3100.
	if overview.Entries[0].CurrentAmount != 3100 {
		t.Errorf("Expected entry 0 amount 3100, got %d", overview.Entries[0].CurrentAmount)
	}
}

func TestDetermineDisplayType(t *testing.T) {
	if determineDisplayType([]int{1}) != "jährlich" {
		t.Error("Expected jährlich")
	}
	if determineDisplayType([]int{1, 7}) != "halbjährlich" {
		t.Error("Expected halbjährlich")
	}
	if determineDisplayType([]int{1, 4, 7, 10}) != "vierteljährlich" {
		t.Error("Expected vierteljährlich")
	}
	if determineDisplayType(models.ALL_MONTHS) != "monatlich" {
		t.Error("Expected monatlich")
	}
}
