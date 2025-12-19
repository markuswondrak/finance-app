package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/api/auth"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("auth_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
			c.Abort()
			return
		}

		secret := os.Getenv("JWT_SECRET")
		claims, err := auth.ValidateJWT(tokenString, secret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Next()
	}
}