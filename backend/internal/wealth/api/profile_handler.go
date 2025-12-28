package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/wealth"
	"wondee/finance-app-backend/internal/wealth/service"
)

type ProfileHandler struct {
	Service *service.ProfileService
}

func (h *ProfileHandler) getWorkspaceID(c *gin.Context) uint {
	workspaceID, exists := c.Get("workspace_id")
	if !exists {
		return 0
	}
	return workspaceID.(uint)
}

func (h *ProfileHandler) getUserID(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}

func (h *ProfileHandler) GetWealthProfile(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)

	profile, err := h.Service.GetProfile(workspaceID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}

func (h *ProfileHandler) UpsertWealthProfile(c *gin.Context) {
	userID := h.getUserID(c)
	workspaceID := h.getWorkspaceID(c)

	var profile wealth.WealthProfile
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	profile.UserID = userID
	profile.WorkspaceID = workspaceID
	if err := h.Service.UpdateProfile(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}
