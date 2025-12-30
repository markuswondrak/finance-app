package api

import (
	"github.com/gin-gonic/gin"
	cost_api "wondee/finance-app-backend/internal/cost/api"
	cost_repo "wondee/finance-app-backend/internal/cost/repository"
	overview_api "wondee/finance-app-backend/internal/overview/api"
	spend_api "wondee/finance-app-backend/internal/spend/api"
	spend_repo "wondee/finance-app-backend/internal/spend/repository"
	"wondee/finance-app-backend/internal/storage"
	user_api "wondee/finance-app-backend/internal/user/api"
	user_service "wondee/finance-app-backend/internal/user/service"
	wealth_api "wondee/finance-app-backend/internal/wealth/api"
	wealth_service "wondee/finance-app-backend/internal/wealth/service"
	workspace_api "wondee/finance-app-backend/internal/workspace/api"
	workspace_service "wondee/finance-app-backend/internal/workspace/service"
)

// Server holds the repository and service dependencies
type Server struct {
	Repo               storage.Repository
	UserService        *user_service.UserService
	OverviewHandler    *overview_api.Handler
	FixedCostHandler   *cost_api.FixedCostHandler
	SpecialCostHandler *cost_api.SpecialCostHandler
	UserHandler        *user_api.Handler
	ProfileHandler     *wealth_api.ProfileHandler
	ForecastHandler    *wealth_api.ForecastHandler
	WorkspaceHandler   *workspace_api.Handler
	SpendHandler       *spend_api.Handler
}

func NewServer(repo storage.Repository) *Server {
	// Create cost repository from the underlying DB connection
	var costRepo cost_repo.Repository
	var spendRepo spend_repo.Repository
	if gormRepo, ok := repo.(*storage.GormRepository); ok {
		costRepo = &cost_repo.PostgresRepository{DB: gormRepo.DB}
		spendRepo = &spend_repo.PostgresRepository{DB: gormRepo.DB}
	} else if mockRepo, ok := repo.(cost_repo.Repository); ok {
		// MockRepository implements cost_repo.Repository
		costRepo = mockRepo
	}
	return NewServerWithDeps(repo, costRepo, spendRepo)
}

func NewServerWithDeps(repo storage.Repository, costRepo cost_repo.Repository, spendRepo spend_repo.Repository) *Server {
	profileService := wealth_service.NewProfileService(repo)
	forecastService := wealth_service.NewForecastService(repo, costRepo)

	// Workspace services
	emailService := workspace_service.NewEmailService()
	workspaceService := workspace_service.NewWorkspaceService(repo)
	inviteService := workspace_service.NewInviteService(repo, emailService)
	userService := user_service.NewUserService(costRepo)

	// Spend handler
	var spendHandler *spend_api.Handler
	if spendRepo != nil {
		spendHandler = spend_api.NewHandler(spendRepo, costRepo)
	}

	return &Server{
		Repo:               repo,
		UserService:        userService,
		OverviewHandler:    &overview_api.Handler{Repo: repo, CostRepo: costRepo},
		FixedCostHandler:   &cost_api.FixedCostHandler{Repo: costRepo},
		SpecialCostHandler: &cost_api.SpecialCostHandler{Repo: costRepo},
		UserHandler:        &user_api.Handler{Repo: repo},
		ProfileHandler:     &wealth_api.ProfileHandler{Service: profileService},
		ForecastHandler:    &wealth_api.ForecastHandler{Service: forecastService},
		WorkspaceHandler: &workspace_api.Handler{
			Repo:             repo,
			WorkspaceService: workspaceService,
			InviteService:    inviteService,
			UserService:      userService,
		},
		SpendHandler: spendHandler,
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

