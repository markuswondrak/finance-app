package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/models"
)

func (s *Server) GetWealthProfile(c *gin.Context) {
	userID := s.getUserID(c)
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	profile, err := s.WealthService.GetProfile(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}

func (s *Server) UpsertWealthProfile(c *gin.Context) {
	userID := s.getUserID(c)
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var profile models.WealthProfile
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	profile.UserID = userID
	if err := s.WealthService.UpdateProfile(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}
