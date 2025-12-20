package api

import (
	"testing"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
)

func TestCreateOverview(t *testing.T) {
	mockRepo := &storage.MockRepository{
		Users: []models.User{
			{
				ID:            1,
				CurrentAmount: 1234,
			},
		},
		FixedCosts:   []models.FixedCost{},
		SpecialCosts: []models.SpecialCost{},
	}
	server := NewServer(mockRepo)

	overview := server.createOverview(1)

	if overview.CurrentAmount != 1234 {
		t.Errorf("Expected CurrentAmount 1234, got %d", overview.CurrentAmount)
	}
}

func TestCreateOverviewDetail(t *testing.T) {
	dueDate := models.CurrentYearMonth()
	mockRepo := &storage.MockRepository{
		FixedCosts: []models.FixedCost{
			{
				ID:       10,
				UserID:   1,
				Name:     "Rent",
				Amount:   -500,
				DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12},
			},
		},
		SpecialCosts: []models.SpecialCost{
			{
				ID:      20,
				UserID:  1,
				Name:    "Car",
				Amount:  -1000,
				DueDate: dueDate,
			},
		},
	}
	server := NewServer(mockRepo)

	detail := server.createOverviewDetail(0, 1)

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
