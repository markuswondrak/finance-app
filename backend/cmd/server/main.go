package main

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"wondee/finance-app-backend/internal/api"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
)

func ConnectDataBase() *gorm.DB {
	// Load .env file if it exists
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

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		panic("Failed to connect to database!")
	}

	err = database.AutoMigrate(&models.FixedCost{}, &models.SpecialCost{}, &models.User{})

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

	db := ConnectDataBase()
	repo := &storage.GormRepository{DB: db}
	server := api.NewServer(repo)

	router.GET("/api/overview/all", server.GetOverview)
	router.GET("/api/overview/detail", server.GetOverviewDetail)

	router.GET("/api/costs", server.GetFixedCosts)
	router.DELETE("/api/costs/:id", server.DeleteFixedCosts)
	router.POST("/api/costs/monthly", server.SaveMonthlyFixedCosts)
	router.POST("/api/costs/halfyearly", server.SaveHalfYearlyFixedCosts)
	router.POST("/api/costs/yearly", server.SaveYearlyFixedCosts)
	router.POST("/api/costs/quaterly", server.SaveQuaterlyFixedCosts)

	router.GET("/api/specialcosts", server.GetSpecialCosts)
	router.POST("/api/specialcosts", server.SaveSpecialCosts)
	router.DELETE("/api/specialcosts/:id", server.DeleteSpecialCosts)

	router.PUT("/api/user/current-amount", server.UpdateCurrentAmount)

	router.Run("localhost:8082")

}
