package api

import (
	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/storage"
	"wondee/finance-app-backend/internal/services"
)

// Server holds the repository and service dependencies
type Server struct {
	Repo             storage.Repository
	WealthService    *services.WealthProfileService
	ForecastService  *services.WealthForecastService
	WorkspaceService *services.WorkspaceService
	InviteService    *services.InviteService
	UserService      *services.UserService
}

func NewServer(repo storage.Repository) *Server {
	// Note: EmailService dependency is needed for InviteService. 
	// Ideally passed to NewServer or initialized here.
	// For simplicity, initializing here, but MockRepo tests might need MockEmailService if InviteService uses it.
	// We made InviteService.EmailService public or passed in NewInviteService.
	emailService := services.NewEmailService()
	
	return &Server{
		Repo:             repo,
		WealthService:    services.NewWealthProfileService(repo),
		ForecastService:  services.NewWealthForecastService(repo),
		WorkspaceService: services.NewWorkspaceService(repo),
		InviteService:    services.NewInviteService(repo, emailService),
		UserService:      services.NewUserService(repo),
	}
}

func (s *Server) getUserID(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}

func (s *Server) getWorkspaceID(c *gin.Context) uint {
	workspaceID, exists := c.Get("workspace_id")
	if !exists {
		return 0
	}
	return workspaceID.(uint)
}

