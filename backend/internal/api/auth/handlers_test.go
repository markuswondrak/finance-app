package auth

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"wondee/finance-app-backend/internal/models"
)

// MockRepository for testing
type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) Create(user *models.User) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockRepository) GetByEmail(email string) (*models.User, error) {
	args := m.Called(email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *MockRepository) GetByID(id uint) (*models.User, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *MockRepository) Update(user *models.User) error {
	args := m.Called(user)
	return args.Error(0)
}

// Repository interface methods (placeholders)
func (m *MockRepository) LoadFixedCosts(workspaceID uint) *[]models.FixedCost        { return nil }
func (m *MockRepository) LoadFixedCostsByUser(userID uint) *[]models.FixedCost       { return nil }
func (m *MockRepository) SaveFixedObject(cost *models.FixedCost)                     {}
func (m *MockRepository) DeleteFixedCost(id int, workspaceID uint)                   {}
func (m *MockRepository) LoadSpecialCosts(workspaceID uint) *[]models.SpecialCost    { return nil }
func (m *MockRepository) LoadSpecialCostsByUser(userID uint) *[]models.SpecialCost   { return nil }
func (m *MockRepository) SaveSpecialCost(cost *models.SpecialCost)                   {}
func (m *MockRepository) DeleteSpecialCost(id int, workspaceID uint)                 {}
func (m *MockRepository) GetUser() (*models.User, error)                             { return nil, nil }
func (m *MockRepository) UpdateUserCurrentAmount(amount int) error                   { return nil }
func (m *MockRepository) Delete(id uint) error                                       { return nil }
func (m *MockRepository) GetWealthProfile(workspaceID uint) (*models.WealthProfile, error) {
	return nil, nil
}
func (m *MockRepository) UpsertWealthProfile(profile *models.WealthProfile) error { return nil }
func (m *MockRepository) PurgeUserData(userID uint) error                         { return nil }

// Workspace methods
func (m *MockRepository) CreateWorkspace(workspace *models.Workspace) error       { return nil }
func (m *MockRepository) GetWorkspaceByID(id uint) (*models.Workspace, error)     { return nil, nil }
func (m *MockRepository) UpdateWorkspace(workspace *models.Workspace) error       { return nil }

// Invite methods
func (m *MockRepository) CreateInvite(invite *models.Invite) error                { return nil }
func (m *MockRepository) GetInviteByToken(token string) (*models.Invite, error)   { return nil, nil }
func (m *MockRepository) UpdateInvite(invite *models.Invite) error                { return nil }
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
