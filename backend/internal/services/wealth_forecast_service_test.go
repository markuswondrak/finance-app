package services

import (
	"testing"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
)

func TestCalculateForecast(t *testing.T) {
	mockRepo := &storage.MockRepository{
		WealthProfiles: []models.WealthProfile{
			{
				UserID:                1,
				CurrentWealth:         10000,
				ForecastDurationYears: 5,
				RateWorstCase:         0.0,
				RateAverageCase:       5.0,
				RateBestCase:          10.0,
			},
		},
		FixedCosts: []models.FixedCost{
			{
				UserID:   1,
				Name:     "Saving",
				Amount:   -500,
				IsSaving: true,
			},
			{
				UserID:   1,
				Name:     "Rent",
				Amount:   -1000,
				IsSaving: false,
			},
		},
	}

	service := NewWealthForecastService(mockRepo)

	forecast, err := service.CalculateForecast(1)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if forecast.DurationYears != 5 {
		t.Errorf("Expected duration 5, got %d", forecast.DurationYears)
	}

	if len(forecast.Points) != 5 {
		t.Errorf("Expected 5 points, got %d", len(forecast.Points))
	}

	if forecast.MonthlySaving != 500 {
		t.Errorf("Expected monthly saving 500, got %f", forecast.MonthlySaving)
	}

	lastPoint := forecast.Points[4]
	if lastPoint.Invested != 10000+5*12*500 { // 10000 + 30000 = 40000
		t.Errorf("Expected invested 40000, got %f", lastPoint.Invested)
	}

	if lastPoint.Best <= lastPoint.Average {
		t.Errorf("Expected Best > Average, got Best=%f Avg=%f", lastPoint.Best, lastPoint.Average)
	}

	    if lastPoint.Average <= lastPoint.Worst {
	        t.Errorf("Expected Average > Worst, got Avg=%f Worst=%f", lastPoint.Average, lastPoint.Worst)
	    }
	}
	
	func TestCalculateForecast_WithSpecialSavings(t *testing.T) {
		specialSavingDate := models.NextYearMonth(models.CurrentYearMonth())
		
		mockRepo := &storage.MockRepository{
			WealthProfiles: []models.WealthProfile{
				{
					UserID:                1,
					CurrentWealth:         10000,
					ForecastDurationYears: 1, // 1 year for simplicity
					RateWorstCase:         0.0,
					RateAverageCase:       0.0,
					RateBestCase:          0.0, // 0% interest for easier calculation
				},
			},
			FixedCosts: []models.FixedCost{}, // No monthly savings
			SpecialCosts: []models.SpecialCost{
				{
					UserID:   1,
					Name:     "Bonus",
					Amount:   5000,
					IsSaving: true,
					DueDate:  specialSavingDate,
				},
				{
					UserID:   1,
					Name:     "Car",
					Amount:   20000,
					IsSaving: false, // Expense, should be IGNORED per current logic
					DueDate:  specialSavingDate,
				},
			},
		}
	
		service := NewWealthForecastService(mockRepo)
	
		forecast, err := service.CalculateForecast(1)
	
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}
	
		if len(forecast.Points) != 1 {
			t.Fatalf("Expected 1 point, got %d", len(forecast.Points))
		}
		
		lastPoint := forecast.Points[0]
		// Start 10000 + Bonus 5000 = 15000. 
		// Expense 20000 is ignored.
		expected := 15000.0
		
		if lastPoint.Invested != expected {
			t.Errorf("Expected invested %f, got %f", expected, lastPoint.Invested)
		}
	}
	
	func TestCalculateForecast_NoProfile(t *testing.T) {	mockRepo := &storage.MockRepository{}
	service := NewWealthForecastService(mockRepo)

	_, err := service.CalculateForecast(999)
	if err == nil {
		t.Error("Expected error for missing profile")
	}
}
