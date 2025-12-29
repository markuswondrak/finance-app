package api

import (
	"net/http"
	"strconv"

	"wondee/finance-app-backend/internal/cost"
	cost_repo "wondee/finance-app-backend/internal/cost/repository"
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/storage"

	"github.com/gin-gonic/gin"
)

const MAX_ENTRIES = 30

type Handler struct {
	Repo     storage.Repository
	CostRepo cost_repo.Repository
}

type Overview struct {
	CurrentAmount int             `json:"currentAmount"`
	Entries       []OverviewEntry `json:"entries"`
}

type OverviewEntry struct {
	YearMonth       types.YearMonth `json:"yearMonth"`
	CurrentAmount   int              `json:"currentAmount"`
	SumFixedCosts   int              `json:"sumFixedCosts"`
	SumSpecialCosts int              `json:"sumSpecialCosts"`
}

type CostDetail struct {
	ID     int    `json:"id"`
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

func (h *Handler) GetOverview(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)
	c.IndentedJSON(http.StatusOK, h.createOverview(workspaceID))
}

func (h *Handler) GetOverviewDetail(c *gin.Context) {
	n, err := strconv.Atoi(c.Query("index"))

	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	workspaceID := h.getWorkspaceID(c)
	c.IndentedJSON(
		http.StatusOK,
		h.createOverviewDetail(n, workspaceID),
	)
}

func (h *Handler) createOverviewDetail(n int, workspaceID uint) OverviewDetail {
	if n > MAX_ENTRIES {
		return OverviewDetail{}
	}

	relevantFixedCostsMap := h.createRelevantMap(workspaceID)
	specialCostMap := h.createSpecialCostMap(workspaceID)

	yearMonth := types.AddMonths(types.CurrentYearMonth(), n)

	fixedCosts := make([]FixedCostDetail, 0)
	specialCosts := make([]CostDetail, 0)

	for _, cost := range relevantFixedCostsMap[yearMonth.Month] {
		if types.IsRelevant(yearMonth, cost.From, cost.To) {

			costDetail := FixedCostDetail{}
			costDetail.ID = cost.ID
			costDetail.Amount = cost.Amount
			costDetail.Name = cost.Name
			costDetail.DisplayType = determineDisplayType(cost.DueMonth)

			fixedCosts = append(fixedCosts, costDetail)
		}
	}

	if costs := specialCostMap[*yearMonth]; costs != nil {
		for _, cost := range costs {
			specialCosts = append(specialCosts, CostDetail{
				ID:     cost.ID,
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

func (h *Handler) createOverview(workspaceID uint) Overview {
	currentAmount := 0
	if workspace, err := h.Repo.GetWorkspaceByID(workspaceID); err == nil {
		currentAmount = workspace.CurrentAmount
	}

	entries := make([]OverviewEntry, MAX_ENTRIES)

	relevantFixedCostsMap := h.createRelevantMap(workspaceID)
	specialCostMap := h.createSpecialCostMap(workspaceID)

	tmpAmount := currentAmount
	tmpYearMonth := types.CurrentYearMonth()

	for i := range entries {
		sumFixedCosts := 0

		for _, fixcost := range relevantFixedCostsMap[tmpYearMonth.Month] {
			if types.IsRelevant(tmpYearMonth, fixcost.From, fixcost.To) {
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
		tmpYearMonth = types.NextYearMonth(tmpYearMonth)
		tmpAmount = newTmpAmount
	}

	return Overview{
		CurrentAmount: currentAmount,
		Entries:       entries,
	}

}

func (h *Handler) createRelevantMap(workspaceID uint) map[int][]cost.FixedCost {
	result := make(map[int][]cost.FixedCost)
	for _, c := range *h.CostRepo.LoadFixedCosts(workspaceID) {
		for _, dueMonth := range c.DueMonth {
			if result[dueMonth] == nil {
				result[dueMonth] = []cost.FixedCost{c}
			} else {
				result[dueMonth] =
					append(result[dueMonth], c)
			}
		}
	}

	return result
}

func (h *Handler) createSpecialCostMap(workspaceID uint) map[types.YearMonth][]cost.SpecialCost {
	result := make(map[types.YearMonth][]cost.SpecialCost)
	for _, sc := range *h.CostRepo.LoadSpecialCosts(workspaceID) {
		if sc.DueDate == nil {
			continue
		}
		if result[*sc.DueDate] == nil {
			result[*sc.DueDate] = []cost.SpecialCost{sc}
		} else {
			result[*sc.DueDate] =
				append(result[*sc.DueDate], sc)
		}
	}

	return result
}

func (h *Handler) getWorkspaceID(c *gin.Context) uint {
	workspaceID, exists := c.Get("workspace_id")
	if !exists {
		return 0
	}
	return workspaceID.(uint)
}