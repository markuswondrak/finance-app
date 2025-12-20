package api

import (
	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/storage"
	"wondee/finance-app-backend/internal/services"
)

// Server holds the repository and service dependencies
type Server struct {
	Repo           storage.Repository
	WealthService *services.WealthProfileService
}

func NewServer(repo storage.Repository) *Server {
	return &Server{
		Repo:          repo,
		WealthService: services.NewWealthProfileService(repo),
	}
}

func (s *Server) getUserID(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}
