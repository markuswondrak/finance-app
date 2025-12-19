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
