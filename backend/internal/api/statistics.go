package api

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/models"
)

func (s *Server) GetSurplusStatistics(c *gin.Context) {
	current := models.CurrentYearMonth()
	stats := s.CalculateSurplusStatistics(current)
	c.JSON(http.StatusOK, stats)
}

func (s *Server) CalculateSurplusStatistics(current *models.YearMonth) models.SurplusStatistics {
	costs := s.Repo.LoadFixedCosts()

	// 1. Calculate History (Past 6 months including current)
	history := make([]models.SurplusPoint, 0, 6)
	
	// Start 5 months before current
	start := *current
	for i := 0; i < 5; i++ {
		start = getPreviousMonth(start)
	}
	
	iter := start
	for i := 0; i < 6; i++ {
		surplus := s.calculateMonthlySurplus(costs, &iter)
		
		point := models.SurplusPoint{
			Month:     fmt.Sprintf("%04d-%02d", iter.Year, iter.Month),
			Surplus:   surplus,
			Projected: false, 
		}
		history = append(history, point)
		
		iter = getNextMonth(iter)
	}

	// 2. Calculate Current Statistics (based on Current Month)
	currentIncome, currentExpenses := s.calculateMonthlyBreakdown(costs, current)
	currentSurplus := currentIncome + currentExpenses

	return models.SurplusStatistics{
		CurrentSurplus:  currentSurplus,
		MonthlyIncome:   currentIncome,
		MonthlyExpenses: -currentExpenses, // Display as positive
		History:         history,
	}
}

func (s *Server) calculateMonthlySurplus(costs *[]models.FixedCost, month *models.YearMonth) float64 {
	income, expenses := s.calculateMonthlyBreakdown(costs, month)
	return income + expenses
}

func (s *Server) calculateMonthlyBreakdown(costs *[]models.FixedCost, month *models.YearMonth) (float64, float64) {
	var income float64
	var expenses float64

	if costs != nil {
		for _, cost := range *costs {
			if models.IsRelevant(month, cost.From, cost.To) {
				monthlyAmount := float64(cost.Amount*len(cost.DueMonth)) / 12.0

				if monthlyAmount > 0 {
					income += monthlyAmount
				} else {
					expenses += monthlyAmount
				}
			}
		}
	}
	return income, expenses
}

func getPreviousMonth(ym models.YearMonth) models.YearMonth {
	if ym.Month == 1 {
		return models.YearMonth{Year: ym.Year - 1, Month: 12}
	}
	return models.YearMonth{Year: ym.Year, Month: ym.Month - 1}
}

func getNextMonth(ym models.YearMonth) models.YearMonth {
	if ym.Month == 12 {
		return models.YearMonth{Year: ym.Year + 1, Month: 1}
	}
	return models.YearMonth{Year: ym.Year, Month: ym.Month + 1}
}
