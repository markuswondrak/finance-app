package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
)

func TestUpdateCurrentAmount(t *testing.T) {
	// Setup
	mockRepo := &storage.MockRepository{
		Users: []models.User{
			{
				ID:            1,
				CurrentAmount: 500,
			},
		},
	}
	server := NewServer(mockRepo)
	gin.SetMode(gin.TestMode)
	r := gin.New()
	
	// Middleware to inject user_id for testing
	r.Use(func(c *gin.Context) {
		c.Set("user_id", uint(1))
		c.Next()
	})
	
	r.PUT("/user/current-amount", server.UpdateCurrentAmount)

	// Execute
	reqBody, _ := json.Marshal(map[string]int{
		"amount": 1000,
	})
	req, _ := http.NewRequest(http.MethodPut, "/user/current-amount", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Verify
	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	// Check if repo was updated
	user, _ := mockRepo.GetByID(1)
	if user.CurrentAmount != 1000 {
		t.Errorf("Expected repo to be updated to 1000, got %d", user.CurrentAmount)
	}
}