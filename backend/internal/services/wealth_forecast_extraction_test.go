package services

import (
	"testing"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
)

func TestCalculateForecast_WithWealthExtraction(t *testing.T) {
	mockRepo := &storage.MockRepository{
		WealthProfiles: []models.WealthProfile{
			{
				UserID:                1,
				CurrentWealth:         10000,
				ForecastDurationYears: 1,
				RateWorstCase:         0.0,
				RateAverageCase:       0.0,
				RateBestCase:          0.0,
			},
		},
		FixedCosts: []models.FixedCost{
			{
				UserID:   1,
				Name:     "Pension Payout",
				Amount:   500, // Positive amount = Extraction
				IsSaving: true,
			},
		},
	}

	service := NewWealthForecastService(mockRepo)

	forecast, err := service.CalculateForecast(1)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Expected behavior:
	// Extraction of 500 per month means Wealth reduces by 500 per month.
	// Monthly change should be -500.
	
	// Note: The current implementation might calculate 'MonthlySaving' as an absolute sum.
	// We want it to reflect the net flow.
	// If the service sums up "Savings", extraction is negative saving.
	
	if forecast.MonthlySaving != -500 {
		t.Errorf("Expected monthly saving/flow of -500, got %f", forecast.MonthlySaving)
	}

	lastPoint := forecast.Points[0]
	// Start 10000. 12 months * (-500) = -6000. End = 4000.
	expected := 4000.0

	if lastPoint.Invested != expected {
		t.Errorf("Expected invested %f, got %f", expected, lastPoint.Invested)
	}
}
