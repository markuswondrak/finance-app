package integration_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"wondee/finance-app-backend/internal/api"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/storage"
	"wondee/finance-app-backend/internal/user"
)

// CostsResponse mirrors the API response structure
type CostsResponse struct {
	CurrentBalance float64 `json:"currentBalance"`
	Monthly        []struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	} `json:"monthly"`
}

func TestWorkspaceAccess_Integration(t *testing.T) {
	gin.SetMode(gin.TestMode)

    var workspaceID uint = 1
    var otherWorkspaceID uint = 2
    
    // User 1 in Workspace A
    user1 := user.User{ID: 1, WorkspaceID: workspaceID}
    // User 2 in Workspace A
    user2 := user.User{ID: 2, WorkspaceID: workspaceID}
    // User 3 in Workspace B
    user3 := user.User{ID: 3, WorkspaceID: otherWorkspaceID}
    
    // Cost created by User 1 in Workspace A
    cost1 := cost.FixedCost{ID: 1, UserID: 1, WorkspaceID: workspaceID, Name: "Shared Cost", Amount: 100, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}}
    // Cost created by User 3 in Workspace B
    cost3 := cost.FixedCost{ID: 2, UserID: 3, WorkspaceID: otherWorkspaceID, Name: "Private Cost", Amount: 50, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}}

	mockRepo := &storage.MockRepository{
		Users:      []user.User{user1, user2, user3},
		FixedCosts: []cost.FixedCost{cost1, cost3},
	}
	server := api.NewServer(mockRepo)
    
    // User 2 Router (Accessing Workspace A)
	routerUser2 := gin.New()
	routerUser2.Use(func(c *gin.Context) {
		c.Set("user_id", uint(2))
        c.Set("workspace_id", workspaceID)
		c.Next()
	})
	routerUser2.GET("/api/costs", server.FixedCostHandler.GetFixedCosts)

    t.Run("User 2 sees User 1's cost in same workspace", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/costs", nil)
		w := httptest.NewRecorder()
		routerUser2.ServeHTTP(w, req)

        assert.Equal(t, http.StatusOK, w.Code)

        var response CostsResponse
        err := json.Unmarshal(w.Body.Bytes(), &response)
        assert.NoError(t, err)

        // Should see cost1 (Shared Cost) in monthly costs
        found := false
        for _, c := range response.Monthly {
            if c.Name == "Shared Cost" {
                found = true
                break
            }
        }

        assert.True(t, found, "Shared cost should be visible to user in same workspace")
    })
}
