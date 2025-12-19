package api

import (
	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/storage"
)

// Server holds the repository dependencies
type Server struct {
	Repo storage.Repository
}

func NewServer(repo storage.Repository) *Server {
	return &Server{Repo: repo}
}

func (s *Server) getUserID(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}
