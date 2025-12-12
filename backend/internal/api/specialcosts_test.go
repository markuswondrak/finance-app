package api

import (
	"testing"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
)

func TestCreateSpecialCosts(t *testing.T) {
	mockRepo := &storage.MockRepository{
		SpecialCosts: []models.SpecialCost{
			{ID: 1, Name: "S1", Amount: 100, DueDate: &models.YearMonth{Year: 2023, Month: 1}},
			{ID: 2, Name: "S2", Amount: 200, DueDate: &models.YearMonth{Year: 2023, Month: 2}},
		},
	}
	server := NewServer(mockRepo)

	result := server.createSpecialCosts()

	if len(result) != 2 {
		t.Errorf("Expected 2 special costs, got %d", len(result))
	}
	if result[0].Name != "S1" {
		t.Errorf("Expected first cost name S1, got %s", result[0].Name)
	}
}
