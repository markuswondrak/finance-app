package middleware

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"wondee/finance-app-backend/internal/api/auth"
)

func TestAuthMiddleware(t *testing.T) {
	// Setup
	os.Setenv("JWT_SECRET", "testsecret")
	gin.SetMode(gin.TestMode)

	t.Run("No Cookie", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest("GET", "/", nil)

		AuthMiddleware()(c)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
		assert.True(t, c.IsAborted())
	})

	t.Run("Valid Cookie", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest("GET", "/", nil)

		var workspaceID uint = 1
		token, _ := auth.GenerateJWT(1, workspaceID, "testsecret", time.Hour)
		c.Request.AddCookie(&http.Cookie{Name: "auth_token", Value: token})

		AuthMiddleware()(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.False(t, c.IsAborted())
		userID, exists := c.Get("user_id")
		assert.True(t, exists)
		assert.Equal(t, uint(1), userID)

		wsID, exists := c.Get("workspace_id")
		assert.True(t, exists)
		assert.Equal(t, workspaceID, wsID)
	})
}
