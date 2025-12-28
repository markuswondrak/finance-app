package auth

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/user"
	"wondee/finance-app-backend/internal/wealth"
	"wondee/finance-app-backend/internal/workspace"
)

// MockRepository for testing
type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) Create(user *user.User) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockRepository) GetByEmail(email string) (*user.User, error) {
	args := m.Called(email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*user.User), args.Error(1)
}

func (m *MockRepository) GetByID(id uint) (*user.User, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*user.User), args.Error(1)
}

func (m *MockRepository) Update(user *user.User) error {
	args := m.Called(user)
	return args.Error(0)
}

// Repository interface methods (placeholders)
func (m *MockRepository) LoadFixedCosts(workspaceID uint) *[]cost.FixedCost        { return nil }
func (m *MockRepository) LoadFixedCostsByUser(userID uint) *[]cost.FixedCost       { return nil }
func (m *MockRepository) SaveFixedObject(c *cost.FixedCost)                        {}
func (m *MockRepository) DeleteFixedCost(id int, workspaceID uint)                 {}
func (m *MockRepository) LoadSpecialCosts(workspaceID uint) *[]cost.SpecialCost    { return nil }
func (m *MockRepository) LoadSpecialCostsByUser(userID uint) *[]cost.SpecialCost   { return nil }
func (m *MockRepository) SaveSpecialCost(c *cost.SpecialCost)                      {}
func (m *MockRepository) DeleteSpecialCost(id int, workspaceID uint)               {}
func (m *MockRepository) GetUser() (*user.User, error)                             { return nil, nil }
func (m *MockRepository) UpdateUserCurrentAmount(amount int) error                   { return nil }
func (m *MockRepository) Delete(id uint) error                                       { return nil }
func (m *MockRepository) GetWealthProfile(workspaceID uint) (*wealth.WealthProfile, error) {
	return nil, nil
}
func (m *MockRepository) UpsertWealthProfile(profile *wealth.WealthProfile) error { return nil }
func (m *MockRepository) PurgeUserData(userID uint) error                         { return nil }

// Workspace methods
func (m *MockRepository) CreateWorkspace(ws *workspace.Workspace) error           { return nil }
func (m *MockRepository) GetWorkspaceByID(id uint) (*workspace.Workspace, error)  { return nil, nil }
func (m *MockRepository) UpdateWorkspace(ws *workspace.Workspace) error           { return nil }

// Invite methods
func (m *MockRepository) CreateInvite(invite *workspace.Invite) error             { return nil }
func (m *MockRepository) GetInviteByToken(token string) (*workspace.Invite, error) { return nil, nil }
func (m *MockRepository) UpdateInvite(invite *workspace.Invite) error             { return nil }
func (m *MockRepository) DeleteInvite(token string) error                         { return nil }

func TestLogin(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	mockRepo := new(MockRepository)
	authHandler := NewAuthHandler(mockRepo)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	// Need a request for Redirect to work
	c.Request, _ = http.NewRequest("GET", "/auth/google/login", nil)

	// Execute
	authHandler.Login(c)

	// Assert
	assert.Equal(t, http.StatusTemporaryRedirect, w.Code)
	// Location header should contain google.com
	assert.Contains(t, w.Header().Get("Location"), "accounts.google.com")
}

func TestMe_Unauthorized(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	mockRepo := new(MockRepository)
	authHandler := NewAuthHandler(mockRepo)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request, _ = http.NewRequest("GET", "/auth/me", nil)
	// No cookie set

	// Execute
	authHandler.Me(c)

	// Assert
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
