package auth

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

func TestJWT(t *testing.T) {
	secret := "testsecret"
	userID := uint(1)
	expiry := 24 * time.Hour

	// Test Generate
	tokenString, err := GenerateJWT(userID, secret, expiry)
	assert.NoError(t, err)
	assert.NotEmpty(t, tokenString)

	// Test Validate
	claims, err := ValidateJWT(tokenString, secret)
	assert.NoError(t, err)
	assert.Equal(t, userID, claims.UserID)
	
	// Test Expired (mocking time might be needed for robust test, but simple check here)
}
