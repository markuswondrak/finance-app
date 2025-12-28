package service

import (
	"fmt"
	"math"
	"wondee/finance-app-backend/internal/cost"
	cost_repo "wondee/finance-app-backend/internal/cost/repository"
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/storage"
	"wondee/finance-app-backend/internal/wealth"
)

type ForecastService struct {
	Repo     storage.Repository
	CostRepo cost_repo.Repository
}

func NewForecastService(repo storage.Repository, costRepo cost_repo.Repository) *ForecastService {
	return &ForecastService{Repo: repo, CostRepo: costRepo}
}

func (s *ForecastService) CalculateForecast(userID uint, workspaceID uint) (*wealth.ForecastResponse, error) {
	// 1. Get Wealth Profile
	profile, err := s.Repo.GetWealthProfile(workspaceID)
	if err != nil {
		return nil, err
	}

	// 2. Get Saving Fixed Costs
	fixedCosts := s.CostRepo.LoadFixedCosts(workspaceID)
	monthlySaving := 0.0
	var fixedCostsWithDependency []cost.FixedCost
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
	specialCosts := s.CostRepo.LoadSpecialCosts(workspaceID)
	specialSavingsMap := make(map[types.YearMonth]float64)
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

	points := make([]wealth.ForecastPoint, durationYears)
	currentYear := types.CurrentYearMonth().Year
	simDate := types.CurrentYearMonth()

	simWorst := startCapital
	simAvg := startCapital
	simBest := startCapital
	simInvested := startCapital

	rateWorstMonthly := profile.RateWorstCase / 12 / 100
	rateAvgMonthly := profile.RateAverageCase / 12 / 100
	rateBestMonthly := profile.RateBestCase / 12 / 100

	for y := 1; y <= durationYears; y++ {
		for m := 0; m < 12; m++ {
			simDate = types.NextYearMonth(simDate)

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
				if types.IsRelevant(simDate, cost.From, cost.To) {
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

		points[y-1] = wealth.ForecastPoint{
			Year:     currentYear + y,
			Invested: math.Round(simInvested*100) / 100,
			Worst:    math.Round(simWorst*100) / 100,
			Average:  math.Round(simAvg*100) / 100,
			Best:     math.Round(simBest*100) / 100,
		}
	}

	return &wealth.ForecastResponse{
		Points:        points,
		StartCapital:  startCapital,
		MonthlySaving: monthlySaving,
		DurationYears: durationYears,
	}, nil
}
