package api

import (
	"fmt"
	"net/http"

	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/overview/model"
	"wondee/finance-app-backend/internal/platform/types"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetSurplusStatistics(c *gin.Context) {
	current := types.CurrentYearMonth()
	workspaceID := h.getWorkspaceID(c)
	stats := h.CalculateSurplusStatistics(current, workspaceID)
	c.JSON(http.StatusOK, stats)
}

func (h *Handler) CalculateSurplusStatistics(current *types.YearMonth, workspaceID uint) model.SurplusStatistics {
	costs := h.CostRepo.LoadFixedCosts(workspaceID)

	// 1. Calculate History (Past 6 months including current)
	history := make([]model.SurplusPoint, 0, 6)

	// Start 5 months before current
	start := *current
	for i := 0; i < 5; i++ {
		start = getPreviousMonth(start)
	}

	iter := start
	for i := 0; i < 6; i++ {
		surplus := h.calculateMonthlySurplus(costs, &iter)

		point := model.SurplusPoint{
			Month:     fmt.Sprintf("%04d-%02d", iter.Year, iter.Month),
			Surplus:   surplus,
			Projected: false,
		}
		history = append(history, point)

		iter = getNextMonth(iter)
	}

	// 2. Calculate Current Statistics (based on Current Month)
	currentIncome, currentExpenses := h.calculateMonthlyBreakdown(costs, current)
	currentSurplus := currentIncome + currentExpenses

	return model.SurplusStatistics{
		CurrentSurplus:  currentSurplus,
		MonthlyIncome:   currentIncome,
		MonthlyExpenses: -currentExpenses, // Display as positive
		History:         history,
	}
}

func (h *Handler) calculateMonthlySurplus(costs *[]cost.FixedCost, month *types.YearMonth) float64 {
	income, expenses := h.calculateMonthlyBreakdown(costs, month)
	return income + expenses
}

func (h *Handler) calculateMonthlyBreakdown(costs *[]cost.FixedCost, month *types.YearMonth) (float64, float64) {
	var income float64
	var expenses float64

	if costs != nil {
		for _, cost := range *costs {
			if types.IsRelevant(month, cost.From, cost.To) {
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

func getPreviousMonth(ym types.YearMonth) types.YearMonth {
	if ym.Month == 1 {
		return types.YearMonth{Year: ym.Year - 1, Month: 12}
	}
	return types.YearMonth{Year: ym.Year, Month: ym.Month - 1}
}

func getNextMonth(ym types.YearMonth) types.YearMonth {
	if ym.Month == 12 {
		return types.YearMonth{Year: ym.Year + 1, Month: 1}
	}
	return types.YearMonth{Year: ym.Year, Month: ym.Month + 1}
}