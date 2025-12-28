package storage

import (
	"testing"
	"wondee/finance-app-backend/internal/cost"

	"github.com/stretchr/testify/assert"
)

func TestDataIsolation(t *testing.T) {
	var workspace1ID uint = 1
	var workspace2ID uint = 2

	repo := &MockRepository{
		FixedCosts: []cost.FixedCost{
			{ID: 1, UserID: 1, WorkspaceID: workspace1ID, Name: "Workspace 1 Cost", Amount: 100},
			{ID: 2, UserID: 2, WorkspaceID: workspace2ID, Name: "Workspace 2 Cost", Amount: 200},
		},
		SpecialCosts: []cost.SpecialCost{
			{ID: 1, UserID: 1, WorkspaceID: workspace1ID, Name: "Workspace 1 Special", Amount: 500},
			{ID: 2, UserID: 2, WorkspaceID: workspace2ID, Name: "Workspace 2 Special", Amount: 1000},
		},
	}

	// Test FixedCosts isolation by workspace
	ws1Fixed := repo.LoadFixedCosts(workspace1ID)
	assert.Len(t, *ws1Fixed, 1)
	assert.Equal(t, "Workspace 1 Cost", (*ws1Fixed)[0].Name)

	ws2Fixed := repo.LoadFixedCosts(workspace2ID)
	assert.Len(t, *ws2Fixed, 1)
	assert.Equal(t, "Workspace 2 Cost", (*ws2Fixed)[0].Name)

	// Test SpecialCosts isolation by workspace
	ws1Special := repo.LoadSpecialCosts(workspace1ID)
	assert.Len(t, *ws1Special, 1)
	assert.Equal(t, "Workspace 1 Special", (*ws1Special)[0].Name)

	ws2Special := repo.LoadSpecialCosts(workspace2ID)
	assert.Len(t, *ws2Special, 1)
	assert.Equal(t, "Workspace 2 Special", (*ws2Special)[0].Name)

	// Test Delete isolation by workspace
	repo.DeleteFixedCost(1, workspace2ID) // Workspace 2 tries to delete Workspace 1's cost
	assert.Len(t, repo.FixedCosts, 2)     // Nothing deleted

	repo.DeleteFixedCost(1, workspace1ID) // Workspace 1 deletes their own cost
	assert.Len(t, repo.FixedCosts, 1)
	assert.Equal(t, 2, repo.FixedCosts[0].ID)
}
