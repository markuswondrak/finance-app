package storage

import (
	"testing"
	"wondee/finance-app-backend/internal/models"
	"github.com/stretchr/testify/assert"
)

func TestDataIsolation(t *testing.T) {
	repo := &MockRepository{
		FixedCosts: []models.FixedCost{
			{ID: 1, UserID: 1, Name: "User 1 Cost", Amount: 100},
			{ID: 2, UserID: 2, Name: "User 2 Cost", Amount: 200},
		},
		SpecialCosts: []models.SpecialCost{
			{ID: 1, UserID: 1, Name: "User 1 Special", Amount: 500},
			{ID: 2, UserID: 2, Name: "User 2 Special", Amount: 1000},
		},
	}

	// Test FixedCosts isolation
	user1Fixed := repo.LoadFixedCosts(1)
	assert.Len(t, *user1Fixed, 1)
	assert.Equal(t, "User 1 Cost", (*user1Fixed)[0].Name)

	user2Fixed := repo.LoadFixedCosts(2)
	assert.Len(t, *user2Fixed, 1)
	assert.Equal(t, "User 2 Cost", (*user2Fixed)[0].Name)

	// Test SpecialCosts isolation
	user1Special := repo.LoadSpecialCosts(1)
	assert.Len(t, *user1Special, 1)
	assert.Equal(t, "User 1 Special", (*user1Special)[0].Name)

	user2Special := repo.LoadSpecialCosts(2)
	assert.Len(t, *user2Special, 1)
	assert.Equal(t, "User 2 Special", (*user2Special)[0].Name)

	// Test Delete isolation
	repo.DeleteFixedCost(1, 2) // User 2 tries to delete User 1's cost
	assert.Len(t, repo.FixedCosts, 2) // Nothing deleted

	repo.DeleteFixedCost(1, 1) // User 1 deletes their own cost
	assert.Len(t, repo.FixedCosts, 1)
	assert.Equal(t, 2, repo.FixedCosts[0].ID)
}
