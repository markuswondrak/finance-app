package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/cost/repository"
	"wondee/finance-app-backend/internal/platform/types"
)

type SpecialCostHandler struct {
	Repo repository.Repository
}

type JsonSpecialCost struct {
	ID       int              `json:"id"`
	Name     string           `json:"name"`
	Amount   int              `json:"amount"`
	DueDate  *types.YearMonth `json:"dueDate"`
	IsSaving bool             `json:"isSaving"`
}

func (h *SpecialCostHandler) GetSpecialCosts(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)
	c.IndentedJSON(http.StatusOK, h.createSpecialCosts(workspaceID))
}

func (h *SpecialCostHandler) SaveSpecialCosts(c *gin.Context) {
	var jsonCost JsonSpecialCost
	err := c.ShouldBindJSON(&jsonCost)

	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	dbObject, err := ToDBSpecialCost(&jsonCost)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	dbObject.UserID = h.getUserID(c)
	dbObject.WorkspaceID = h.getWorkspaceID(c)
	h.Repo.SaveSpecialCost(dbObject)
}

func ToDBSpecialCost(jsonCost *JsonSpecialCost) (*cost.SpecialCost, error) {
	// Validation removed to support Wealth Extraction (IsSaving=true, Amount>0)

	return &cost.SpecialCost{
		ID:       jsonCost.ID,
		Name:     jsonCost.Name,
		Amount:   jsonCost.Amount,
		DueDate:  jsonCost.DueDate,
		IsSaving: jsonCost.IsSaving,
	}, nil
}

func (h *SpecialCostHandler) DeleteSpecialCosts(c *gin.Context) {
	param := c.Param("id")
	id, err := strconv.Atoi(param)

	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	workspaceID := h.getWorkspaceID(c)
	h.Repo.DeleteSpecialCost(id, workspaceID)
}

func (h *SpecialCostHandler) createSpecialCosts(workspaceID uint) (result []JsonSpecialCost) {
	result = make([]JsonSpecialCost, 0)

	specialCosts := h.Repo.LoadSpecialCosts(workspaceID)

	for _, cost := range *specialCosts {
		result = append(result, JsonSpecialCost{
			ID:       cost.ID,
			Name:     cost.Name,
			Amount:   cost.Amount,
			DueDate:  cost.DueDate,
			IsSaving: cost.IsSaving,
		})
	}

	return
}

func (h *SpecialCostHandler) getUserID(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}

func (h *SpecialCostHandler) getWorkspaceID(c *gin.Context) uint {
	workspaceID, exists := c.Get("workspace_id")
	if !exists {
		return 0
	}
	return workspaceID.(uint)
}