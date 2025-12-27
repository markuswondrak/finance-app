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
	"wondee/finance-app-backend/internal/api/auth"
	"wondee/finance-app-backend/internal/api/middleware"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
	"wondee/finance-app-backend/internal/storage/migrations"
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

	// Step 1: Pre-migrate - add workspace_id columns as nullable to preserve existing data
	if err := migrations.PreMigrateWorkspaces(database); err != nil {
		panic(fmt.Sprintf("Failed to run pre-migration: %v", err))
	}

	// Step 2: Backfill - create workspaces for existing users and link their data
	if err := migrations.BackfillWorkspaces(database); err != nil {
		panic(fmt.Sprintf("Failed to run backfill migration: %v", err))
	}

	// Step 3: AutoMigrate - now safe to add NOT NULL constraints since data is populated
	// Order matters: Workspace must be created before tables that reference it
	err = database.AutoMigrate(&models.Workspace{}, &models.User{}, &models.FixedCost{}, &models.SpecialCost{}, &models.WealthProfile{}, &models.Invite{})

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
	frontendRegex := regexp.MustCompile(`^https://finanz-frontend-.*\.run\.app$`)

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
		apiGroup.GET("/overview/all", server.GetOverview)
		apiGroup.GET("/overview/detail", server.GetOverviewDetail)

		apiGroup.GET("/costs", server.GetFixedCosts)
		apiGroup.DELETE("/costs/:id", server.DeleteFixedCosts)
		apiGroup.POST("/costs/monthly", server.SaveMonthlyFixedCosts)
		apiGroup.POST("/costs/halfyearly", server.SaveHalfYearlyFixedCosts)
		apiGroup.POST("/costs/yearly", server.SaveYearlyFixedCosts)
		apiGroup.POST("/costs/quaterly", server.SaveQuaterlyFixedCosts)

		apiGroup.GET("/specialcosts", server.GetSpecialCosts)
		apiGroup.POST("/specialcosts", server.SaveSpecialCosts)
		apiGroup.DELETE("/specialcosts/:id", server.DeleteSpecialCosts)

		apiGroup.PUT("/user/current-amount", server.UpdateCurrentAmount)
		apiGroup.DELETE("/user", server.DeleteCurrentUser)

		apiGroup.GET("/wealth-profile", server.GetWealthProfile)
		apiGroup.PUT("/wealth-profile", server.UpsertWealthProfile)

		apiGroup.GET("/wealth/forecast", server.GetWealthForecast)

		apiGroup.GET("/statistics/surplus", server.GetSurplusStatistics)

		apiGroup.GET("/workspace", server.GetWorkspace)
		apiGroup.POST("/workspaces/invite", server.InviteMember)
		apiGroup.POST("/workspaces/join", server.JoinWorkspace)
	}

	port := getEnv("PORT", "8082")
	router.Run(":" + port)
}
