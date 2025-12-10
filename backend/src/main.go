package main

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDataBase() {
	// Load .env file if it exists
	_ = godotenv.Load("../.env")

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

	err = database.AutoMigrate(&FixedCost{}, &SpecialCost{})

	if err != nil {
		panic(err)
	}

	DB = database
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

	ConnectDataBase()

	router.GET("/api/overview/all", GetOverview)
	router.GET("/api/overview/detail", GetOverviewDetail)

	router.GET("/api/costs", GetFixedCosts)
	router.DELETE("/api/costs/:id", DeleteFixedCosts)
	router.POST("/api/costs/monthly", SaveMonthlyFixedCosts)
	router.POST("/api/costs/halfyearly", SaveHalfYearlyFixedCosts)
	router.POST("/api/costs/yearly", SaveYearlyFixedCosts)
	router.POST("/api/costs/quaterly", SaveQuaterlyFixedCosts)

	router.GET("/api/specialcosts", GetSpecialCosts)
	router.POST("/api/specialcosts", SaveSpecialCosts)
	router.DELETE("/api/specialcosts/:id", DeleteSpecialCosts)

	router.Run("localhost:8082")

}
