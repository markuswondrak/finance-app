package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/wealth/service"
)

type ForecastHandler struct {
	Service *service.ForecastService
}

func (h *ForecastHandler) getUserID(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}

func (h *ForecastHandler) getWorkspaceID(c *gin.Context) uint {
	workspaceID, exists := c.Get("workspace_id")
	if !exists {
		return 0
	}
	return workspaceID.(uint)
}

func (h *ForecastHandler) GetWealthForecast(c *gin.Context) {
	userID := h.getUserID(c)
	workspaceID := h.getWorkspaceID(c)
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	forecast, err := h.Service.CalculateForecast(userID, workspaceID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, forecast)
}
