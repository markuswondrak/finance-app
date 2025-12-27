package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/models"
)

type JsonSpecialCost struct {
	ID       int               `json:"id"`
	Name     string            `json:"name"`
	Amount   int               `json:"amount"`
	DueDate  *models.YearMonth `json:"dueDate"`
	IsSaving bool              `json:"isSaving"`
}

func (s *Server) GetSpecialCosts(c *gin.Context) {
	workspaceID := s.getWorkspaceID(c)
	c.IndentedJSON(http.StatusOK, s.createSpecialCosts(workspaceID))
}

func (s *Server) SaveSpecialCosts(c *gin.Context) {
	var cost JsonSpecialCost
	err := c.ShouldBindJSON(&cost)

	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	dbObject, err := ToDBSpecialCost(&cost)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	dbObject.UserID = s.getUserID(c)
	dbObject.WorkspaceID = s.getWorkspaceID(c)
	s.Repo.SaveSpecialCost(dbObject)
}

func ToDBSpecialCost(cost *JsonSpecialCost) (*models.SpecialCost, error) {
	// Validation removed to support Wealth Extraction (IsSaving=true, Amount>0)

	return &models.SpecialCost{
		ID:       cost.ID,
		Name:     cost.Name,
		Amount:   cost.Amount,
		DueDate:  cost.DueDate,
		IsSaving: cost.IsSaving,
	}, nil
}

func (s *Server) DeleteSpecialCosts(c *gin.Context) {
	param := c.Param("id")
	id, err := strconv.Atoi(param)

	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	workspaceID := s.getWorkspaceID(c)
	s.Repo.DeleteSpecialCost(id, workspaceID)
}

func (s *Server) createSpecialCosts(workspaceID uint) (result []JsonSpecialCost) {
	result = make([]JsonSpecialCost, 0)

	specialCosts := s.Repo.LoadSpecialCosts(workspaceID)

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
