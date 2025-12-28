package api

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/cost/repository"
	"wondee/finance-app-backend/internal/platform/types"
)

type FixedCostHandler struct {
	Repo repository.Repository
}

type Response struct {
	CurrentBalance float64         `json:"currentBalance"`
	Monthly        []JsonFixedCost `json:"monthly"`
	Quarterly      []JsonFixedCost `json:"quarterly"`
	Halfyearly     []JsonFixedCost `json:"halfyearly"`
	Yearly         []JsonFixedCost `json:"yearly"`
}

type JsonFixedCost struct {
	ID       int              `json:"id"`
	Name     string           `json:"name"`
	Amount   int              `json:"amount"`
	From     *types.YearMonth `json:"from"`
	To       *types.YearMonth `json:"to"`
	DueMonth int              `json:"dueMonth"`
	IsSaving bool             `json:"isSaving"`
}

func (h *FixedCostHandler) GetFixedCosts(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)
	c.IndentedJSON(http.StatusOK, h.createFixedCosts(workspaceID))
}

func (h *FixedCostHandler) DeleteFixedCosts(c *gin.Context) {
	param := c.Param("id")
	id, err := strconv.Atoi(param)

	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	workspaceID := h.getWorkspaceID(c)
	h.Repo.DeleteFixedCost(id, workspaceID)
}

func (h *FixedCostHandler) SaveYearlyFixedCosts(c *gin.Context) {
	h.saveFixedCost(c, func(dueMonth int) ([]int, error) {
		if dueMonth < 0 || dueMonth > 12 {
			return nil, errors.New("dueMonth for yearly must be between 1 and 12")
		}
		return []int{dueMonth}, nil
	})
}

func (h *FixedCostHandler) SaveHalfYearlyFixedCosts(c *gin.Context) {
	h.saveFixedCost(c, func(dueMonth int) ([]int, error) {
		if dueMonth < 0 || dueMonth > 6 {
			return nil, errors.New("dueMonth for halfyearly must be between 1 and 6")
		}

		return []int{dueMonth, dueMonth + 6}, nil
	})
}

func (h *FixedCostHandler) SaveQuaterlyFixedCosts(c *gin.Context) {
	h.saveFixedCost(c, func(dueMonth int) ([]int, error) {
		if dueMonth < 0 || dueMonth > 3 {
			return nil, errors.New("dueMonth for halfyearly must be between 1 and 3")
		}

		return []int{dueMonth, dueMonth + 3, dueMonth + 6, dueMonth + 9}, nil
	})
}

func (h *FixedCostHandler) SaveMonthlyFixedCosts(c *gin.Context) {
	h.saveFixedCost(c, func(_ int) ([]int, error) {
		return cost.ALL_MONTHS, nil
	})
}

func (h *FixedCostHandler) saveFixedCost(c *gin.Context, dueMonthConverter func(int) ([]int, error)) {
	var jsonCost JsonFixedCost
	err := c.ShouldBindJSON(&jsonCost)

	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	dbObject, err := ToDBStruct(&jsonCost, dueMonthConverter)

	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	dbObject.UserID = h.getUserID(c)
	dbObject.WorkspaceID = h.getWorkspaceID(c)

	h.Repo.SaveFixedObject(dbObject)
}

func (h *FixedCostHandler) createFixedCosts(workspaceID uint) Response {

	costs := h.Repo.LoadFixedCosts(workspaceID)
	totalAnnualBalance := 0
	currentYearMonth := types.CurrentYearMonth()

	monthly := make([]JsonFixedCost, 0)
	quaterly := make([]JsonFixedCost, 0)
	halfyearly := make([]JsonFixedCost, 0)
	yearly := make([]JsonFixedCost, 0)

	for _, cost := range *costs {
		if types.IsRelevant(currentYearMonth, cost.From, cost.To) {
			totalAnnualBalance += (cost.Amount * len(cost.DueMonth))
		}

		switch month := len(cost.DueMonth); month {
		case 1:
			yearly = append(yearly, ToJsonStruct(&cost))
		case 2:
			halfyearly = append(halfyearly, ToJsonStruct(&cost))
		case 4:
			quaterly = append(quaterly, ToJsonStruct(&cost))
		case 12:
			monthly = append(monthly, ToJsonStruct(&cost))
		default:
			panic("only 1, 2, 4 and 12 is valid, but was " + strconv.Itoa(month))
		}
	}

	return Response{
		CurrentBalance: float64(totalAnnualBalance) / 12.0,
		Monthly:        monthly,
		Quarterly:      quaterly,
		Halfyearly:     halfyearly,
		Yearly:         yearly,
	}
}

func ToJsonStruct(dbObject *cost.FixedCost) JsonFixedCost {
	return JsonFixedCost{
		ID:       dbObject.ID,
		Name:     dbObject.Name,
		Amount:   dbObject.Amount,
		From:     dbObject.From,
		To:       dbObject.To,
		DueMonth: dbObject.DueMonth[0],
		IsSaving: dbObject.IsSaving,
	}
}

func ToDBStruct(
	jsonObject *JsonFixedCost,
	dueMonthCreator func(int) ([]int, error),
) (*cost.FixedCost, error) {
	// Validation removed to support Wealth Extraction (IsSaving=true, Amount>0)

	value, err := dueMonthCreator(jsonObject.DueMonth)

	if err != nil {
		return nil, err
	}

	return &cost.FixedCost{
		ID:       jsonObject.ID,
		Name:     jsonObject.Name,
		Amount:   jsonObject.Amount,
		From:     jsonObject.From,
		To:       jsonObject.To,
		DueMonth: value,
		IsSaving: jsonObject.IsSaving,
	}, nil
}

func (h *FixedCostHandler) getUserID(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}

func (h *FixedCostHandler) getWorkspaceID(c *gin.Context) uint {
	workspaceID, exists := c.Get("workspace_id")
	if !exists {
		return 0
	}
	return workspaceID.(uint)
}