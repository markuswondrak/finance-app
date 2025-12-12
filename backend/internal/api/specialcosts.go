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
}

func (s *Server) GetSpecialCosts(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, s.createSpecialCosts())
}

func (s *Server) SaveSpecialCosts(c *gin.Context) {
	var cost JsonSpecialCost
	err := c.ShouldBindJSON(&cost)

	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	dbObject := models.SpecialCost{
		ID:      cost.ID,
		Name:    cost.Name,
		Amount:  cost.Amount,
		DueDate: cost.DueDate,
	}

	s.Repo.SaveSpecialCost(&dbObject)
}

func (s *Server) DeleteSpecialCosts(c *gin.Context) {
	param := c.Param("id")
	id, err := strconv.Atoi(param)

	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	s.Repo.DeleteSpecialCost(id)
}

func (s *Server) createSpecialCosts() (result []JsonSpecialCost) {
	result = make([]JsonSpecialCost, 0)

	specialCosts := s.Repo.LoadSpecialCosts()

	for _, cost := range *specialCosts {
		result = append(result, JsonSpecialCost{
			ID:      cost.ID,
			Name:    cost.Name,
			Amount:  cost.Amount,
			DueDate: cost.DueDate,
		})
	}

	return
}
