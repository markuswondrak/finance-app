package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) GetWealthForecast(c *gin.Context) {
	userID := s.getUserID(c)
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	forecast, err := s.ForecastService.CalculateForecast(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, forecast)
}
