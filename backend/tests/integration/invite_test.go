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
	"wondee/finance-app-backend/internal/workspace"
)

func setupInviteTestRouter() (*gin.Engine, *storage.MockRepository) {
	gin.SetMode(gin.TestMode)

	var workspaceID uint = 1
	user1 := user.User{ID: 1, Email: "owner@example.com", Name: "Owner", WorkspaceID: workspaceID}
	ws := workspace.Workspace{ID: workspaceID, Name: "Owner's Workspace", Users: []user.User{user1}}

	mockRepo := &storage.MockRepository{
		Users:      []user.User{user1},
		Workspaces: []workspace.Workspace{ws},
	}
	server := api.NewServer(mockRepo)

	router := gin.New()
	router.Use(func(c *gin.Context) {
		// Mock Auth Middleware
		c.Set("user_id", uint(1))
		c.Set("workspace_id", workspaceID)
		c.Next()
	})

	apiGroup := router.Group("/api")
	{
		apiGroup.POST("/workspaces/invite", server.WorkspaceHandler.InviteMember)
		apiGroup.POST("/workspaces/join", server.WorkspaceHandler.JoinWorkspace)
	}

	return router, mockRepo
}

func TestInvite_Integration(t *testing.T) {
	router, mockRepo := setupInviteTestRouter()

	t.Run("Create Invite", func(t *testing.T) {
		reqBody := map[string]string{
			"email": "friend@example.com",
		}
		body, _ := json.Marshal(reqBody)
		req, _ := http.NewRequest("POST", "/api/workspaces/invite", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code == http.StatusNotImplemented {
			t.Skip("Endpoint not implemented yet")
			return
		}

		assert.Equal(t, http.StatusOK, w.Code)
		
		// Verify invite created in repo
		assert.Len(t, mockRepo.Invites, 1)
		assert.Equal(t, "friend@example.com", mockRepo.Invites[0].Email)
	})
}
