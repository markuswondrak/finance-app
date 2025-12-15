package api

import (
	"testing"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
)

func TestCreateOverview(t *testing.T) {
	mockRepo := &storage.MockRepository{
		User: models.User{
			CurrentAmount: 1234,
		},
		FixedCosts:   []models.FixedCost{},
		SpecialCosts: []models.SpecialCost{},
	}
	server := NewServer(mockRepo)

	overview := server.createOverview()

	if overview.CurrentAmount != 1234 {
		t.Errorf("Expected CurrentAmount 1234, got %d", overview.CurrentAmount)
	}
}