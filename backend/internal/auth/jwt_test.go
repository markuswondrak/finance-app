package auth

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestJWT(t *testing.T) {
	secret := "testsecret"
	userID := uint(1)
	var workspaceID uint = 1
	expiry := 24 * time.Hour

	// Test Generate
	tokenString, err := GenerateJWT(userID, workspaceID, secret, expiry)
	assert.NoError(t, err)
	assert.NotEmpty(t, tokenString)

	// Test Validate
	claims, err := ValidateJWT(tokenString, secret)
	assert.NoError(t, err)
	assert.Equal(t, userID, claims.UserID)
	assert.Equal(t, workspaceID, claims.WorkspaceID)

	// Test Expired (mocking time might be needed for robust test, but simple check here)
}
