package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/storage"
	"wondee/finance-app-backend/internal/user"
	"wondee/finance-app-backend/internal/workspace"
)

func TestUpdateCurrentAmount(t *testing.T) {
	// Setup
	mockRepo := &storage.MockRepository{
		Users: []user.User{
			{
				ID:          1,
				WorkspaceID: 1,
			},
		},
		Workspaces: []workspace.Workspace{
			{
				ID:            1,
				Name:          "Test Workspace",
				CurrentAmount: 500,
			},
		},
	}
	handler := &Handler{Repo: mockRepo}
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// Middleware to inject user_id and workspace_id for testing
	r.Use(func(c *gin.Context) {
		c.Set("user_id", uint(1))
		c.Set("workspace_id", uint(1))
		c.Next()
	})

	r.PUT("/user/current-amount", handler.UpdateCurrentAmount)

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

	// Check if workspace was updated
	ws, _ := mockRepo.GetWorkspaceByID(1)
	if ws.CurrentAmount != 1000 {
		t.Errorf("Expected workspace to be updated to 1000, got %d", ws.CurrentAmount)
	}
}

func TestUpdateOnboardingStatus_Success(t *testing.T) {
	// Setup
	mockRepo := &storage.MockRepository{
		Users: []user.User{
			{
				ID:                  1,
				WorkspaceID:         1,
				OnboardingCompleted: false,
			},
		},
	}
	handler := &Handler{Repo: mockRepo}
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// Middleware to inject user_id for testing
	r.Use(func(c *gin.Context) {
		c.Set("user_id", uint(1))
		c.Next()
	})

	r.PATCH("/user/onboarding-status", handler.UpdateOnboardingStatus)

	// Execute
	reqBody, _ := json.Marshal(map[string]bool{
		"completed": true,
	})
	req, _ := http.NewRequest(http.MethodPatch, "/user/onboarding-status", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Verify response status
	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	// Verify user was updated
	updatedUser, _ := mockRepo.GetByID(1)
	if !updatedUser.OnboardingCompleted {
		t.Errorf("Expected OnboardingCompleted to be true, got false")
	}

	// Verify response body contains user
	var response user.User
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Errorf("Failed to unmarshal response: %v", err)
	}
	if !response.OnboardingCompleted {
		t.Errorf("Expected response OnboardingCompleted to be true, got false")
	}
}

func TestUpdateOnboardingStatus_Unauthorized(t *testing.T) {
	// Setup
	mockRepo := &storage.MockRepository{
		Users: []user.User{},
	}
	handler := &Handler{Repo: mockRepo}
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// No middleware - simulates unauthorized request
	r.PATCH("/user/onboarding-status", handler.UpdateOnboardingStatus)

	// Execute
	reqBody, _ := json.Marshal(map[string]bool{
		"completed": true,
	})
	req, _ := http.NewRequest(http.MethodPatch, "/user/onboarding-status", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Verify
	if w.Code != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", w.Code)
	}
}

func TestUpdateOnboardingStatus_InvalidRequest(t *testing.T) {
	// Setup
	mockRepo := &storage.MockRepository{
		Users: []user.User{
			{
				ID:                  1,
				WorkspaceID:         1,
				OnboardingCompleted: false,
			},
		},
	}
	handler := &Handler{Repo: mockRepo}
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// Middleware to inject user_id for testing
	r.Use(func(c *gin.Context) {
		c.Set("user_id", uint(1))
		c.Next()
	})

	r.PATCH("/user/onboarding-status", handler.UpdateOnboardingStatus)

	// Execute with missing completed field
	reqBody, _ := json.Marshal(map[string]string{
		"invalid": "field",
	})
	req, _ := http.NewRequest(http.MethodPatch, "/user/onboarding-status", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Verify
	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}

	// Verify error message
	var response map[string]string
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Errorf("Failed to unmarshal response: %v", err)
	}
	if response["error"] != "Invalid request: completed field is required" {
		t.Errorf("Expected error message about completed field, got %s", response["error"])
	}
}
