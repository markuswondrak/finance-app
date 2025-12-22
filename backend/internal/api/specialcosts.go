package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/models"
)

type JsonSpecialCost struct {
	ID      int               `json:"id"`
	Name    string            `json:"name"`
	Amount  int               `json:"amount"`
	DueDate *models.YearMonth `json:"dueDate"`
	IsSaving bool             `json:"isSaving"`
}

func (s *Server) GetSpecialCosts(c *gin.Context) {
	userID := s.getUserID(c)
	c.IndentedJSON(http.StatusOK, s.createSpecialCosts(userID))
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

	userID := s.getUserID(c)
	s.Repo.DeleteSpecialCost(id, userID)
}

func (s *Server) createSpecialCosts(userID uint) (result []JsonSpecialCost) {
	result = make([]JsonSpecialCost, 0)

	specialCosts := s.Repo.LoadSpecialCosts(userID)

	for _, cost := range *specialCosts {
		result = append(result, JsonSpecialCost{
			ID:      cost.ID,
			Name:     cost.Name,
			Amount:   cost.Amount,
			DueDate:  cost.DueDate,
			IsSaving: cost.IsSaving,
		})
	}

	return
}
