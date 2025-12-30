package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/spend"
	"wondee/finance-app-backend/internal/workspace"
)

// MockSpendRepository implements spend repository.Repository
type MockSpendRepository struct {
	mock.Mock
}

func (m *MockSpendRepository) GetWorkspace(workspaceID uint) (*workspace.Workspace, error) {
	args := m.Called(workspaceID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*workspace.Workspace), args.Error(1)
}

func (m *MockSpendRepository) UpdateSaveToSpendBalance(workspaceID uint, amount int) error {
	args := m.Called(workspaceID, amount)
	return args.Error(0)
}

func (m *MockSpendRepository) GetPaymentStatuses(workspaceID uint, month types.YearMonth) ([]spend.MonthlyPaymentStatus, error) {
	args := m.Called(workspaceID, month)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]spend.MonthlyPaymentStatus), args.Error(1)
}

func (m *MockSpendRepository) CountPaymentStatuses(workspaceID uint, month types.YearMonth) (int64, error) {
	args := m.Called(workspaceID, month)
	return args.Get(0).(int64), args.Error(1)
}

func (m *MockSpendRepository) CreatePaymentStatus(status *spend.MonthlyPaymentStatus) error {
	args := m.Called(status)
	return args.Error(0)
}

func (m *MockSpendRepository) UpdatePaymentStatus(status *spend.MonthlyPaymentStatus) error {
	args := m.Called(status)
	return args.Error(0)
}

func (m *MockSpendRepository) DeletePaymentStatus(workspaceID uint, fixedCostID int, month types.YearMonth) error {
	args := m.Called(workspaceID, fixedCostID, month)
	return args.Error(0)
}

func (m *MockSpendRepository) GetPaymentStatus(workspaceID uint, fixedCostID int, month types.YearMonth) (*spend.MonthlyPaymentStatus, error) {
	args := m.Called(workspaceID, fixedCostID, month)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*spend.MonthlyPaymentStatus), args.Error(1)
}

func (m *MockSpendRepository) GetOneTimeCosts(workspaceID uint, month types.YearMonth) ([]spend.OneTimePendingCost, error) {
	args := m.Called(workspaceID, month)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]spend.OneTimePendingCost), args.Error(1)
}

func (m *MockSpendRepository) CreateOneTimeCost(cost *spend.OneTimePendingCost) error {
	args := m.Called(cost)
	return args.Error(0)
}

func (m *MockSpendRepository) UpdateOneTimeCost(cost *spend.OneTimePendingCost) error {
	args := m.Called(cost)
	return args.Error(0)
}

func (m *MockSpendRepository) DeleteOneTimeCost(id uint, workspaceID uint) error {
	args := m.Called(id, workspaceID)
	return args.Error(0)
}

func (m *MockSpendRepository) GetOneTimeCost(id uint, workspaceID uint) (*spend.OneTimePendingCost, error) {
	args := m.Called(id, workspaceID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*spend.OneTimePendingCost), args.Error(1)
}

// MockCostRepository implements cost repository.Repository
type MockCostRepository struct {
	mock.Mock
}

func (m *MockCostRepository) LoadFixedCosts(workspaceID uint) *[]cost.FixedCost {
	args := m.Called(workspaceID)
	return args.Get(0).(*[]cost.FixedCost)
}

func (m *MockCostRepository) LoadFixedCostsByUser(userID uint) *[]cost.FixedCost {
	args := m.Called(userID)
	return args.Get(0).(*[]cost.FixedCost)
}

func (m *MockCostRepository) SaveFixedObject(fixedCost *cost.FixedCost) {
	m.Called(fixedCost)
}

func (m *MockCostRepository) DeleteFixedCost(id int, workspaceID uint) {
	m.Called(id, workspaceID)
}

func (m *MockCostRepository) LoadSpecialCosts(workspaceID uint) *[]cost.SpecialCost {
	args := m.Called(workspaceID)
	return args.Get(0).(*[]cost.SpecialCost)
}

func (m *MockCostRepository) LoadSpecialCostsByUser(userID uint) *[]cost.SpecialCost {
	args := m.Called(userID)
	return args.Get(0).(*[]cost.SpecialCost)
}

func (m *MockCostRepository) SaveSpecialCost(costs *cost.SpecialCost) {
	m.Called(costs)
}

func (m *MockCostRepository) DeleteSpecialCost(id int, workspaceID uint) {
	m.Called(id, workspaceID)
}

func setupTestRouter(handler *Handler) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(func(c *gin.Context) {
		c.Set("workspace_id", uint(1))
		c.Next()
	})
	return router
}

// ==================== User Story 1 Tests ====================

func TestGetSaveToSpend_BasicCalculation(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	// Setup mocks
	mockSpendRepo.On("CountPaymentStatuses", workspaceID, mock.Anything).Return(int64(1), nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000, // 5000 EUR
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false},
	}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	// Negative amount = expense
	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: -100000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}},
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.GET("/save-to-spend", handler.GetSaveToSpend)

	req, _ := http.NewRequest("GET", "/save-to-spend", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response SaveToSpendResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	// 500000 + (-100000) = 400000 (4000 EUR)
	assert.Equal(t, 400000, response.SafeToSpend)
	assert.Equal(t, 500000, response.CheckingBalance)
}

func TestGetSaveToSpend_NegativeResult(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	mockSpendRepo.On("CountPaymentStatuses", workspaceID, mock.Anything).Return(int64(1), nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 50000, // 500 EUR - less than pending costs
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false},
	}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	// Negative amount = expense
	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: -100000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}},
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.GET("/save-to-spend", handler.GetSaveToSpend)

	req, _ := http.NewRequest("GET", "/save-to-spend", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response SaveToSpendResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	// 50000 + (-100000) = -50000 (-500 EUR negative)
	assert.Equal(t, -50000, response.SafeToSpend)
}

func TestGetSaveToSpend_NoPendingCosts(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	mockSpendRepo.On("CountPaymentStatuses", workspaceID, mock.Anything).Return(int64(1), nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000,
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: true}, // All paid
	}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: -100000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}},
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.GET("/save-to-spend", handler.GetSaveToSpend)

	req, _ := http.NewRequest("GET", "/save-to-spend", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response SaveToSpendResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, 500000, response.SafeToSpend) // Full balance available
	assert.Equal(t, 0, response.PendingTotal)
}

// ==================== User Story 2 Tests ====================

func TestUpdateBalance_Success(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	mockSpendRepo.On("UpdateSaveToSpendBalance", workspaceID, 300000).Return(nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 300000,
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	fixedCosts := []cost.FixedCost{}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.PUT("/save-to-spend/balance", handler.UpdateBalance)

	body, _ := json.Marshal(UpdateBalanceRequest{Amount: 300000})
	req, _ := http.NewRequest("PUT", "/save-to-spend/balance", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response SaveToSpendResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, 300000, response.CheckingBalance)
}

func TestUpdateBalance_NegativeAmount(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	mockSpendRepo.On("UpdateSaveToSpendBalance", workspaceID, -10000).Return(nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: -10000,
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	fixedCosts := []cost.FixedCost{}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.PUT("/save-to-spend/balance", handler.UpdateBalance)

	// Negative amount should now be allowed
	body, _ := json.Marshal(map[string]int{"amount": -10000})
	req, _ := http.NewRequest("PUT", "/save-to-spend/balance", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response SaveToSpendResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, -10000, response.CheckingBalance)
}

// ==================== User Story 5 Tests ====================

func TestIncludeFixedCost_Success(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	// Cost not yet included - GetPaymentStatus returns error
	mockSpendRepo.On("GetPaymentStatus", workspaceID, 1, mock.Anything).Return(nil, assert.AnError)
	mockSpendRepo.On("CreatePaymentStatus", mock.Anything).Return(nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000,
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false},
	}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: 100000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}},
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.POST("/save-to-spend/fixed-costs/:id/include", handler.IncludeFixedCost)

	req, _ := http.NewRequest("POST", "/save-to-spend/fixed-costs/1/include", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockSpendRepo.AssertCalled(t, "CreatePaymentStatus", mock.Anything)
}

func TestExcludeFixedCost_Success(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	mockSpendRepo.On("DeletePaymentStatus", workspaceID, 1, mock.Anything).Return(nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000,
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: 100000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}},
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.POST("/save-to-spend/fixed-costs/:id/exclude", handler.ExcludeFixedCost)

	req, _ := http.NewRequest("POST", "/save-to-spend/fixed-costs/1/exclude", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockSpendRepo.AssertCalled(t, "DeletePaymentStatus", workspaceID, 1, mock.Anything)
}

func TestExcludeFixedCost_NotFound(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	// Delete returns error when not found
	mockSpendRepo.On("DeletePaymentStatus", workspaceID, 999, mock.Anything).Return(assert.AnError)

	router := setupTestRouter(handler)
	router.POST("/save-to-spend/fixed-costs/:id/exclude", handler.ExcludeFixedCost)

	req, _ := http.NewRequest("POST", "/save-to-spend/fixed-costs/999/exclude", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

// ==================== User Story 3 Tests ====================

func TestMarkFixedCostPaid_Success(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	status := &spend.MonthlyPaymentStatus{
		ID:          1,
		WorkspaceID: workspaceID,
		FixedCostID: 1,
		IsPaid:      false,
	}

	mockSpendRepo.On("GetPaymentStatus", workspaceID, 1, mock.Anything).Return(status, nil)
	mockSpendRepo.On("UpdatePaymentStatus", mock.Anything).Return(nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000,
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: true},
	}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: 100000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}},
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.POST("/save-to-spend/fixed-costs/:id/paid", handler.MarkFixedCostPaid)

	req, _ := http.NewRequest("POST", "/save-to-spend/fixed-costs/1/paid", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockSpendRepo.AssertCalled(t, "UpdatePaymentStatus", mock.Anything)
}

func TestMarkFixedCostPending_Success(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	status := &spend.MonthlyPaymentStatus{
		ID:          1,
		WorkspaceID: workspaceID,
		FixedCostID: 1,
		IsPaid:      true,
	}

	mockSpendRepo.On("GetPaymentStatus", workspaceID, 1, mock.Anything).Return(status, nil)
	mockSpendRepo.On("UpdatePaymentStatus", mock.Anything).Return(nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000,
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false},
	}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: 100000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}},
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.POST("/save-to-spend/fixed-costs/:id/pending", handler.MarkFixedCostPending)

	req, _ := http.NewRequest("POST", "/save-to-spend/fixed-costs/1/pending", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestMarkFixedCostPaid_NotIncluded(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	// Cost not included - returns error
	mockSpendRepo.On("GetPaymentStatus", workspaceID, 1, mock.Anything).Return(nil, assert.AnError)

	router := setupTestRouter(handler)
	router.POST("/save-to-spend/fixed-costs/:id/paid", handler.MarkFixedCostPaid)

	req, _ := http.NewRequest("POST", "/save-to-spend/fixed-costs/1/paid", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

// ==================== User Story 4 Tests ====================

func TestGetSaveToSpend_IncludesAllFixedCosts(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	mockSpendRepo.On("CountPaymentStatuses", workspaceID, mock.Anything).Return(int64(2), nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000,
	}, nil)
	// Only cost ID 1 is included
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false},
	}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	// Two fixed costs exist
	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: 100000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}},
		{ID: 2, Name: "Insurance", Amount: 50000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}},
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.GET("/save-to-spend", handler.GetSaveToSpend)

	req, _ := http.NewRequest("GET", "/save-to-spend", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response SaveToSpendResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Len(t, response.IncludedFixedCosts, 1)
	assert.Len(t, response.ExcludedFixedCosts, 1)
	assert.Equal(t, "Rent", response.IncludedFixedCosts[0].Name)
	assert.Equal(t, "Insurance", response.ExcludedFixedCosts[0].Name)
}

func TestGetSaveToSpend_EmptyState(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	mockSpendRepo.On("CountPaymentStatuses", workspaceID, mock.Anything).Return(int64(0), nil)
	// No previous month data
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{}, nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 0,
	}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	// No fixed costs
	fixedCosts := []cost.FixedCost{}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.GET("/save-to-spend", handler.GetSaveToSpend)

	req, _ := http.NewRequest("GET", "/save-to-spend", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response SaveToSpendResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Len(t, response.IncludedFixedCosts, 0)
	assert.Len(t, response.ExcludedFixedCosts, 0)
	assert.Equal(t, 0, response.CheckingBalance)
	assert.Equal(t, 0, response.SafeToSpend)
}

// ==================== User Story 6 Tests ====================

func TestCreateOneTimeCost_Success(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	mockSpendRepo.On("CreateOneTimeCost", mock.Anything).Return(nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000,
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{
		{ID: 1, Name: "Credit Card", Amount: 20000, IsPaid: false},
	}, nil)

	fixedCosts := []cost.FixedCost{}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.POST("/save-to-spend/one-time-costs", handler.CreateOneTimeCost)

	body, _ := json.Marshal(CreateOneTimeCostRequest{Name: "Credit Card", Amount: 20000})
	req, _ := http.NewRequest("POST", "/save-to-spend/one-time-costs", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	mockSpendRepo.AssertCalled(t, "CreateOneTimeCost", mock.Anything)
}

func TestCreateOneTimeCost_ValidationError(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	router := setupTestRouter(handler)
	router.POST("/save-to-spend/one-time-costs", handler.CreateOneTimeCost)

	// Empty name should fail
	body, _ := json.Marshal(CreateOneTimeCostRequest{Name: "", Amount: 20000})
	req, _ := http.NewRequest("POST", "/save-to-spend/one-time-costs", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestDeleteOneTimeCost_Success(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	mockSpendRepo.On("DeleteOneTimeCost", uint(1), workspaceID).Return(nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000,
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{}, nil)

	fixedCosts := []cost.FixedCost{}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.DELETE("/save-to-spend/one-time-costs/:id", handler.DeleteOneTimeCost)

	req, _ := http.NewRequest("DELETE", "/save-to-spend/one-time-costs/1", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockSpendRepo.AssertCalled(t, "DeleteOneTimeCost", uint(1), workspaceID)
}

func TestMarkOneTimeCostPaid_Success(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1

	oneTimeCost := &spend.OneTimePendingCost{
		ID:          1,
		WorkspaceID: workspaceID,
		Name:        "Credit Card",
		Amount:      20000,
		IsPaid:      false,
	}

	mockSpendRepo.On("GetOneTimeCost", uint(1), workspaceID).Return(oneTimeCost, nil)
	mockSpendRepo.On("UpdateOneTimeCost", mock.Anything).Return(nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000,
	}, nil)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{}, nil)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{
		{ID: 1, Name: "Credit Card", Amount: 20000, IsPaid: true},
	}, nil)

	fixedCosts := []cost.FixedCost{}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.POST("/save-to-spend/one-time-costs/:id/paid", handler.MarkOneTimeCostPaid)

	req, _ := http.NewRequest("POST", "/save-to-spend/one-time-costs/1/paid", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockSpendRepo.AssertCalled(t, "UpdateOneTimeCost", mock.Anything)
}

// TestSafeToSpendCalculation_WithSignedAmounts verifies that
// safeToSpend = checkingBalance + pendingTotal (where pendingTotal is signed: negative for expenses, positive for income)
func TestSafeToSpendCalculation_WithSignedAmounts(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	handler := NewHandler(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	checkingBalance := 1000000 // 10,000 EUR

	mockSpendRepo.On("CountPaymentStatuses", workspaceID, mock.Anything).Return(int64(2), nil)
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: checkingBalance,
	}, nil)
	// Two unpaid fixed costs (expenses)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, mock.Anything).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false}, // Rent -100000 unpaid
		{FixedCostID: 2, IsPaid: false}, // Internet -5000 unpaid
	}, nil)
	// One unpaid one-time cost (expense)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, mock.Anything).Return([]spend.OneTimePendingCost{
		{ID: 1, Amount: -20000, IsPaid: false}, // -200 EUR unpaid expense
	}, nil)

	// Negative amounts = expenses
	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: -100000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}},
		{ID: 2, Name: "Internet", Amount: -5000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}},
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	router := setupTestRouter(handler)
	router.GET("/save-to-spend", handler.GetSaveToSpend)

	req, _ := http.NewRequest("GET", "/save-to-spend", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response SaveToSpendResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	// Verify the mathematical relationship: safeToSpend = checkingBalance + pendingTotal
	// PendingTotal is negative because all amounts are expenses
	expectedPendingTotal := -100000 + -5000 + -20000 // -125000 (-1250 EUR)
	expectedSafeToSpend := checkingBalance + expectedPendingTotal // 1000000 + (-125000) = 875000

	assert.Equal(t, checkingBalance, response.CheckingBalance, "CheckingBalance should match")
	assert.Equal(t, expectedPendingTotal, response.PendingTotal, "PendingTotal should be signed sum of unpaid costs")
	assert.Equal(t, expectedSafeToSpend, response.SafeToSpend, "SafeToSpend should be CheckingBalance + PendingTotal")

	// Explicit verification: expenses reduce balance (safeToSpend < checkingBalance when pendingTotal is negative)
	assert.Less(t, response.SafeToSpend, response.CheckingBalance,
		"SafeToSpend must be LESS than CheckingBalance when there are net expenses (negative pendingTotal)")
}
