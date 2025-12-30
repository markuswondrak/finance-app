package main

import (
	"fmt"
	"os"
	"regexp"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"wondee/finance-app-backend/internal/api"
	"wondee/finance-app-backend/internal/auth/api"
	"wondee/finance-app-backend/internal/auth/middleware"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/spend"
	"wondee/finance-app-backend/internal/storage"
	"wondee/finance-app-backend/internal/user"
	"wondee/finance-app-backend/internal/wealth"
	"wondee/finance-app-backend/internal/workspace"
)

func ConnectDataBase() *gorm.DB {
	// Try loading .env from current dir or parent dir
	_ = godotenv.Load(".env")
	_ = godotenv.Load("../.env")
	_ = godotenv.Load("../../.env")

	// Get database configuration from environment variables
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "admin")
	dbName := getEnv("DB_NAME", "financeapp")
	dbSSLMode := getEnv("DB_SSLMODE", "disable")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		dbHost, dbUser, dbPassword, dbName, dbPort, dbSSLMode)

	// Debug Log (Masking Password)
	fmt.Printf("Connecting to DB: host=%s user=%s dbname=%s port=%s sslmode=%s\n",
		dbHost, dbUser, dbName, dbPort, dbSSLMode)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		panic("Failed to connect to database!")
	}

	// Step 3: AutoMigrate - now safe to add NOT NULL constraints since data is populated
	// Order matters: Workspace must be created before tables that reference it
	err = database.AutoMigrate(
		&workspace.Workspace{},
		&user.User{},
		&cost.FixedCost{},
		&cost.SpecialCost{},
		&wealth.WealthProfile{},
		&workspace.Invite{},
		&spend.MonthlyPaymentStatus{},
		&spend.OneTimePendingCost{},
	)

	if err != nil {
		panic(err)
	}

	return database
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func main() {
	router := gin.Default()

	// CORS Configuration
	frontendRegex := regexp.MustCompile(`^https://finanz-frontend-.*\.run\.app$`) // Corrected regex escaping

	router.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:8080" ||
					origin == "http://localhost:5173" ||
					origin == "https://finance.wondee.info" ||
					frontendRegex.MatchString(origin)
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	db := ConnectDataBase()
	repo := &storage.GormRepository{DB: db}
	server := api.NewServer(repo)
	authHandler := auth.NewAuthHandler(repo)

	// Auth Routes
	router.GET("/auth/google/login", authHandler.Login)
	router.GET("/auth/google/callback", authHandler.Callback)
	router.GET("/auth/me", authHandler.Me)
	router.POST("/auth/logout", authHandler.Logout)

	// Protected API Routes
	apiGroup := router.Group("/api")
	apiGroup.Use(middleware.AuthMiddleware())
	{
		apiGroup.GET("/overview/all", server.OverviewHandler.GetOverview)
		apiGroup.GET("/overview/detail", server.OverviewHandler.GetOverviewDetail)

		apiGroup.GET("/costs", server.FixedCostHandler.GetFixedCosts)
		apiGroup.DELETE("/costs/:id", server.FixedCostHandler.DeleteFixedCosts)
		apiGroup.POST("/costs/monthly", server.FixedCostHandler.SaveMonthlyFixedCosts)
		apiGroup.POST("/costs/halfyearly", server.FixedCostHandler.SaveHalfYearlyFixedCosts)
		apiGroup.POST("/costs/yearly", server.FixedCostHandler.SaveYearlyFixedCosts)
		apiGroup.POST("/costs/quaterly", server.FixedCostHandler.SaveQuaterlyFixedCosts)

		apiGroup.GET("/specialcosts", server.SpecialCostHandler.GetSpecialCosts)
		apiGroup.POST("/specialcosts", server.SpecialCostHandler.SaveSpecialCosts)
		apiGroup.DELETE("/specialcosts/:id", server.SpecialCostHandler.DeleteSpecialCosts)

		apiGroup.PUT("/user/current-amount", server.UserHandler.UpdateCurrentAmount)
		apiGroup.PATCH("/user/onboarding-status", server.UserHandler.UpdateOnboardingStatus)
		apiGroup.DELETE("/user", server.UserHandler.DeleteCurrentUser)

		apiGroup.GET("/wealth-profile", server.ProfileHandler.GetWealthProfile)
		apiGroup.PUT("/wealth-profile", server.ProfileHandler.UpsertWealthProfile)

		apiGroup.GET("/wealth/forecast", server.ForecastHandler.GetWealthForecast)

		apiGroup.GET("/statistics/surplus", server.OverviewHandler.GetSurplusStatistics)

		apiGroup.GET("/workspace", server.WorkspaceHandler.GetWorkspace)
		apiGroup.POST("/workspaces/invite", server.WorkspaceHandler.InviteMember)
		apiGroup.POST("/workspaces/join", server.WorkspaceHandler.JoinWorkspace)
		apiGroup.POST("/workspaces/decline", server.WorkspaceHandler.DeclineInvite)

		// Save-to-Spend routes
		if server.SpendHandler != nil {
			apiGroup.GET("/save-to-spend", server.SpendHandler.GetSaveToSpend)
			apiGroup.PUT("/save-to-spend/balance", server.SpendHandler.UpdateBalance)
			apiGroup.POST("/save-to-spend/fixed-costs/:id/paid", server.SpendHandler.MarkFixedCostPaid)
			apiGroup.POST("/save-to-spend/fixed-costs/:id/pending", server.SpendHandler.MarkFixedCostPending)
			apiGroup.POST("/save-to-spend/fixed-costs/:id/include", server.SpendHandler.IncludeFixedCost)
			apiGroup.POST("/save-to-spend/fixed-costs/:id/exclude", server.SpendHandler.ExcludeFixedCost)
			apiGroup.POST("/save-to-spend/one-time-costs", server.SpendHandler.CreateOneTimeCost)
			apiGroup.DELETE("/save-to-spend/one-time-costs/:id", server.SpendHandler.DeleteOneTimeCost)
			apiGroup.POST("/save-to-spend/one-time-costs/:id/paid", server.SpendHandler.MarkOneTimeCostPaid)
			apiGroup.POST("/save-to-spend/one-time-costs/:id/pending", server.SpendHandler.MarkOneTimeCostPending)
		}
	}

	port := getEnv("PORT", "8082")
	router.Run(":" + port)
}