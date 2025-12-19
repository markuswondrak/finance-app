package api

import (
	"net/http"
	"strconv"

	"wondee/finance-app-backend/internal/models"

	"github.com/gin-gonic/gin"
)

const MAX_ENTRIES = 30

type Overview struct {
	CurrentAmount int             `json:"currentAmount"`
	Entries       []OverviewEntry `json:"entries"`
}

type OverviewEntry struct {
	YearMonth       models.YearMonth `json:"yearMonth"`
	CurrentAmount   int              `json:"currentAmount"`
	SumFixedCosts   int              `json:"sumFixedCosts"`
	SumSpecialCosts int              `json:"sumSpecialCosts"`
}

type CostDetail struct {
	Name   string `json:"name"`
	Amount int    `json:"amount"`
}

type FixedCostDetail struct {
	CostDetail
	DisplayType string `json:"displayType"`
}

type OverviewDetail struct {
	FixedCosts   []FixedCostDetail `json:"fixedCosts"`
	SpecialCosts []CostDetail      `json:"specialCosts"`
}

func (s *Server) GetOverview(c *gin.Context) {
	userID := s.getUserID(c)
	c.IndentedJSON(http.StatusOK, s.createOverview(userID))
}

func (s *Server) GetOverviewDetail(c *gin.Context) {
	n, err := strconv.Atoi(c.Query("index"))

	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	userID := s.getUserID(c)
	c.IndentedJSON(
		http.StatusOK,
		s.createOverviewDetail(n, userID),
	)
}

func (s *Server) createOverviewDetail(n int, userID uint) OverviewDetail {
	if n > MAX_ENTRIES {
		return OverviewDetail{}
	}

	relevantFixedCostsMap := s.createRelevantMap(userID)
	specialCostMap := s.createSpecialCostMap(userID)

	yearMonth := models.AddMonths(models.CurrentYearMonth(), n)

	fixedCosts := make([]FixedCostDetail, 0)
	specialCosts := make([]CostDetail, 0)

	for _, cost := range relevantFixedCostsMap[yearMonth.Month] {
		if models.IsRelevant(yearMonth, cost.From, cost.To) {

			costDetail := FixedCostDetail{}
			costDetail.Amount = cost.Amount
			costDetail.Name = cost.Name
			costDetail.DisplayType = determineDisplayType(cost.DueMonth)

			fixedCosts = append(fixedCosts, costDetail)
		}
	}

	if costs := specialCostMap[*yearMonth]; costs != nil {
		for _, cost := range costs {
			specialCosts = append(specialCosts, CostDetail{
				Name:   cost.Name,
				Amount: cost.Amount,
			})
		}
	}

	return OverviewDetail{
		FixedCosts:   fixedCosts,
		SpecialCosts: specialCosts,
	}
}

func determineDisplayType(dueMonth []int) string {
	switch len(dueMonth) {
	case 1:
		return "jährlich"
	case 2:
		return "halbjährlich"
	case 4:
		return "vierteljährlich"
	case 12:
		return "monatlich"
	default:
		return "ILLEGAL"
	}
}

func (s *Server) createOverview(userID uint) Overview {
	// TODO retrieve current amount

	currentAmount := 0
	if user, err := s.Repo.GetByID(userID); err == nil {
		currentAmount = user.CurrentAmount
	}

	entries := make([]OverviewEntry, MAX_ENTRIES)

	relevantFixedCostsMap := s.createRelevantMap(userID)
	specialCostMap := s.createSpecialCostMap(userID)

	tmpAmount := currentAmount
	tmpYearMonth := models.CurrentYearMonth()

	for i := range entries {
		sumFixedCosts := 0

		for _, fixcost := range relevantFixedCostsMap[tmpYearMonth.Month] {
			if models.IsRelevant(tmpYearMonth, fixcost.From, fixcost.To) {
				sumFixedCosts += fixcost.Amount
			}
		}

		sumSpecialCosts := 0

		for _, specialcost := range specialCostMap[*tmpYearMonth] {
			sumSpecialCosts += specialcost.Amount
		}

		newTmpAmount := tmpAmount + sumFixedCosts + sumSpecialCosts
		entries[i] = OverviewEntry{
			YearMonth:       *tmpYearMonth,
			CurrentAmount:   newTmpAmount,
			SumFixedCosts:   sumFixedCosts,
			SumSpecialCosts: sumSpecialCosts,
		}
		tmpYearMonth = models.NextYearMonth(tmpYearMonth)
		tmpAmount = newTmpAmount
	}

	return Overview{
		CurrentAmount: currentAmount,
		Entries:       entries,
	}

}

func (s *Server) createRelevantMap(userID uint) map[int][]models.FixedCost {
	result := make(map[int][]models.FixedCost)
	for _, cost := range *s.Repo.LoadFixedCosts(userID) {
		for _, dueMonth := range cost.DueMonth {
			if result[dueMonth] == nil {
				result[dueMonth] = []models.FixedCost{cost}
			} else {
				result[dueMonth] =
					append(result[dueMonth], cost)
			}
		}
	}

	return result
}

func (s *Server) createSpecialCostMap(userID uint) map[models.YearMonth][]models.SpecialCost {
	result := make(map[models.YearMonth][]models.SpecialCost)
	for _, cost := range *s.Repo.LoadSpecialCosts(userID) {
		if result[*cost.DueDate] == nil {
			result[*cost.DueDate] = []models.SpecialCost{cost}
		} else {
			result[*cost.DueDate] =
				append(result[*cost.DueDate], cost)
		}
	}

	return result
}
