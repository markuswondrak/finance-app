package services

import (
	"fmt"
	"math"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
)

type WealthForecastService struct {
	Repo storage.Repository
}

func NewWealthForecastService(repo storage.Repository) *WealthForecastService {
	return &WealthForecastService{Repo: repo}
}

func (s *WealthForecastService) CalculateForecast(userID uint, workspaceID uint) (*models.ForecastResponse, error) {
	// 1. Get Wealth Profile
	profile, err := s.Repo.GetWealthProfile(workspaceID)
	if err != nil {
		return nil, err
	}

	// 2. Get Saving Fixed Costs
	fixedCosts := s.Repo.LoadFixedCosts(workspaceID)
	monthlySaving := 0.0
	var fixedCostsWithDependency []models.FixedCost
	if fixedCosts != nil {
		for _, cost := range *fixedCosts {
			if cost.IsSaving {
				if cost.From == nil && cost.To == nil {
					monthlySaving -= float64(cost.Amount)
				} else {
					fixedCostsWithDependency = append(fixedCostsWithDependency, cost) //
				}
			}
		}
	}

	fmt.Println("--- monthly saving", monthlySaving)
	fmt.Println("--- fixed costs with dependency", fixedCostsWithDependency)

	// 3. Get Special Costs (Savings)
	specialCosts := s.Repo.LoadSpecialCosts(workspaceID)
	specialSavingsMap := make(map[models.YearMonth]float64)
	if specialCosts != nil {
		for _, cost := range *specialCosts {
			if cost.IsSaving && cost.DueDate != nil {
				// Accumulate in case multiple events happen in the same month
				// Subtract amount to correctly handle savings (negative amount -> positive addition)
				// and extractions (positive amount -> negative deduction)
				specialSavingsMap[*cost.DueDate] -= float64(cost.Amount)
			}
		}
	}

	fmt.Println("--- special savings", specialSavingsMap)

	// 4. Calculate
	startCapital := profile.CurrentWealth
	durationYears := profile.ForecastDurationYears
	if durationYears <= 0 {
		durationYears = 10 // Safety default
	}

	points := make([]models.ForecastPoint, durationYears)
	currentYear := models.CurrentYearMonth().Year
	simDate := models.CurrentYearMonth()

	simWorst := startCapital
	simAvg := startCapital
	simBest := startCapital
	simInvested := startCapital

	rateWorstMonthly := profile.RateWorstCase / 12 / 100
	rateAvgMonthly := profile.RateAverageCase / 12 / 100
	rateBestMonthly := profile.RateBestCase / 12 / 100

	for y := 1; y <= durationYears; y++ {
		for m := 0; m < 12; m++ {
			simDate = models.NextYearMonth(simDate)

			// Add monthly savings
			simWorst += monthlySaving
			simAvg += monthlySaving
			simBest += monthlySaving
			simInvested += monthlySaving

			// Add special savings if any for this month
			if amount, ok := specialSavingsMap[*simDate]; ok {
				simWorst += amount
				simAvg += amount
				simBest += amount
				simInvested += amount
			}

			for _, cost := range fixedCostsWithDependency {
				if models.IsRelevant(simDate, cost.From, cost.To) {
					simWorst -= float64(cost.Amount)
					simAvg -= float64(cost.Amount)
					simBest -= float64(cost.Amount)
					simInvested -= float64(cost.Amount)
				}
			}

			// Apply interest
			simWorst *= (1 + rateWorstMonthly)
			simAvg *= (1 + rateAvgMonthly)
			simBest *= (1 + rateBestMonthly)
		}

		points[y-1] = models.ForecastPoint{
			Year:     currentYear + y,
			Invested: math.Round(simInvested*100) / 100,
			Worst:    math.Round(simWorst*100) / 100,
			Average:  math.Round(simAvg*100) / 100,
			Best:     math.Round(simBest*100) / 100,
		}
	}

	return &models.ForecastResponse{
		Points:        points,
		StartCapital:  startCapital,
		MonthlySaving: monthlySaving,
		DurationYears: durationYears,
	}, nil
}
