package integration_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"wondee/finance-app-backend/internal/api"
	"wondee/finance-app-backend/internal/storage"
	"wondee/finance-app-backend/internal/user"
	"wondee/finance-app-backend/internal/wealth"
)

func setupTestRouter() (*gin.Engine, *storage.MockRepository) {
	gin.SetMode(gin.TestMode)
	mockRepo := &storage.MockRepository{
		Users: []user.User{{ID: 1, Email: "test@example.com"}},
	}
	server := api.NewServer(mockRepo)

	router := gin.New()
	router.Use(func(c *gin.Context) {
		c.Set("user_id", uint(1))
		c.Next()
	})

	apiGroup := router.Group("/api")
	{
		apiGroup.GET("/wealth-profile", server.ProfileHandler.GetWealthProfile)
		apiGroup.PUT("/wealth-profile", server.ProfileHandler.UpsertWealthProfile)
	}

	return router, mockRepo
}

func TestWealthProfile_Integration(t *testing.T) {
	router, _ := setupTestRouter()

	t.Run("Get Profile - Returns Defaults", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/wealth-profile", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var profile wealth.WealthProfile
		err := json.Unmarshal(w.Body.Bytes(), &profile)
		assert.NoError(t, err)
		assert.Equal(t, 10, profile.ForecastDurationYears)
		assert.Equal(t, 5.0, profile.RateAverageCase)
	})

	t.Run("Upsert Profile - Success", func(t *testing.T) {
		newProfile := wealth.WealthProfile{
			CurrentWealth:         10000,
			ForecastDurationYears: 20,
			RateWorstCase:         2,
			RateAverageCase:       4,
			RateBestCase:          6,
		}
		body, _ := json.Marshal(newProfile)
		req, _ := http.NewRequest("PUT", "/api/wealth-profile", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		
		// Verify persistence via GET
		reqGet, _ := http.NewRequest("GET", "/api/wealth-profile", nil)
		wGet := httptest.NewRecorder()
		router.ServeHTTP(wGet, reqGet)
		
		var savedProfile wealth.WealthProfile
		json.Unmarshal(wGet.Body.Bytes(), &savedProfile)
		assert.Equal(t, 10000.0, savedProfile.CurrentWealth)
		assert.Equal(t, 20, savedProfile.ForecastDurationYears)
	})

	t.Run("Upsert Profile - Validation Fail", func(t *testing.T) {
		invalidProfile := wealth.WealthProfile{
			CurrentWealth:         -1,
			ForecastDurationYears: 20,
		}
		body, _ := json.Marshal(invalidProfile)
		req, _ := http.NewRequest("PUT", "/api/wealth-profile", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
		assert.Contains(t, w.Body.String(), "wealth")
	})
}