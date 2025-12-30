package service_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"wondee/finance-app-backend/internal/cost"
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/spend"
	"wondee/finance-app-backend/internal/spend/service"
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

func TestCalculateSafeToSpend_WithPendingCosts(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	svc := service.NewSpendService(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	month := types.YearMonth{Year: 2025, Month: 1}

	// Setup workspace with 500000 cents (5000 EUR) balance
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000,
	}, nil)

	// Setup payment statuses - two included fixed costs, one paid, one pending
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, month).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: true},
		{FixedCostID: 2, IsPaid: false},
	}, nil)

	// Setup fixed costs (negative = expense)
	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: -100000},   // -1000 EUR (expense)
		{ID: 2, Name: "Internet", Amount: -5000}, // -50 EUR (expense)
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	// Setup one-time costs - one pending (negative = expense)
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, month).Return([]spend.OneTimePendingCost{
		{ID: 1, Amount: -20000, IsPaid: false}, // -200 EUR pending expense
	}, nil)

	safeToSpend, err := svc.CalculateSafeToSpend(workspaceID, month)

	assert.NoError(t, err)
	// 500000 + (-5000) + (-20000) = 475000
	assert.Equal(t, 475000, safeToSpend)
}

func TestCalculateSafeToSpend_AllPaid(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	svc := service.NewSpendService(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	month := types.YearMonth{Year: 2025, Month: 1}

	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 500000,
	}, nil)

	mockSpendRepo.On("GetPaymentStatuses", workspaceID, month).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: true},
	}, nil)

	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: -100000}, // negative = expense
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	mockSpendRepo.On("GetOneTimeCosts", workspaceID, month).Return([]spend.OneTimePendingCost{}, nil)

	safeToSpend, err := svc.CalculateSafeToSpend(workspaceID, month)

	assert.NoError(t, err)
	// All paid, so full balance available
	assert.Equal(t, 500000, safeToSpend)
}

func TestCalculateSafeToSpend_NegativeResult(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	svc := service.NewSpendService(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	month := types.YearMonth{Year: 2025, Month: 1}

	// Low balance
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 10000, // 100 EUR
	}, nil)

	mockSpendRepo.On("GetPaymentStatuses", workspaceID, month).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false},
	}, nil)

	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: -100000}, // -1000 EUR pending expense
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	mockSpendRepo.On("GetOneTimeCosts", workspaceID, month).Return([]spend.OneTimePendingCost{}, nil)

	safeToSpend, err := svc.CalculateSafeToSpend(workspaceID, month)

	assert.NoError(t, err)
	// 10000 + (-100000) = -90000 (negative is valid - user overspent)
	assert.Equal(t, -90000, safeToSpend)
}

func TestGetPendingTotal_SumsPendingCosts(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	svc := service.NewSpendService(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	month := types.YearMonth{Year: 2025, Month: 1}

	mockSpendRepo.On("GetPaymentStatuses", workspaceID, month).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false},
		{FixedCostID: 2, IsPaid: true}, // Paid - should not count
		{FixedCostID: 3, IsPaid: false},
	}, nil)

	// Negative amounts = expenses
	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: -100000},
		{ID: 2, Name: "Internet", Amount: -5000},
		{ID: 3, Name: "Phone", Amount: -3000},
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	mockSpendRepo.On("GetOneTimeCosts", workspaceID, month).Return([]spend.OneTimePendingCost{
		{ID: 1, Amount: -20000, IsPaid: false},
		{ID: 2, Amount: -15000, IsPaid: true}, // Paid - should not count
	}, nil)

	pendingTotal, err := svc.GetPendingTotal(workspaceID, month)

	assert.NoError(t, err)
	// (-100000) + (-3000) + (-20000) = -123000 (negative = net expenses)
	assert.Equal(t, -123000, pendingTotal)
}

func TestEnsureInitialized_AlreadyInitialized(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	svc := service.NewSpendService(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	month := types.YearMonth{Year: 2025, Month: 1}

	// Already has records
	mockSpendRepo.On("CountPaymentStatuses", workspaceID, month).Return(int64(5), nil)

	err := svc.EnsureInitialized(workspaceID, month)

	assert.NoError(t, err)
	mockSpendRepo.AssertNotCalled(t, "CreatePaymentStatus", mock.Anything)
}

func TestEnsureInitialized_CopiesFromPreviousMonth(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	svc := service.NewSpendService(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	month := types.YearMonth{Year: 2025, Month: 2}
	prevMonth := types.YearMonth{Year: 2025, Month: 1}

	// No records for current month
	mockSpendRepo.On("CountPaymentStatuses", workspaceID, month).Return(int64(0), nil)

	// Previous month has records
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, prevMonth).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: true},
		{FixedCostID: 2, IsPaid: false},
	}, nil)

	// Expect new records to be created (IsPaid reset to false)
	mockSpendRepo.On("CreatePaymentStatus", mock.MatchedBy(func(s *spend.MonthlyPaymentStatus) bool {
		return s.WorkspaceID == workspaceID && s.Month == month && !s.IsPaid
	})).Return(nil).Twice()

	err := svc.EnsureInitialized(workspaceID, month)

	assert.NoError(t, err)
	mockSpendRepo.AssertNumberOfCalls(t, "CreatePaymentStatus", 2)
}

func TestCalculateSafeToSpend_WithExpenses(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	svc := service.NewSpendService(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	month := types.YearMonth{Year: 2025, Month: 1}

	// Setup workspace with 30000 cents (300 EUR) balance
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 30000,
	}, nil)

	// Setup payment statuses - one unpaid fixed cost
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, month).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false},
	}, nil)

	// Setup fixed costs with NEGATIVE amount (expense)
	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: -135000}, // -1350 EUR expense
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	// No one-time costs
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, month).Return([]spend.OneTimePendingCost{}, nil)

	safeToSpend, err := svc.CalculateSafeToSpend(workspaceID, month)

	assert.NoError(t, err)
	// 30000 + (-135000) = -105000 (-1050 EUR)
	// Negative expense reduces the balance
	assert.Equal(t, -105000, safeToSpend)
}

func TestCalculateSafeToSpend_WithMixedIncomeAndExpenses(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	svc := service.NewSpendService(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	month := types.YearMonth{Year: 2025, Month: 1}

	// Setup workspace with 100000 cents (1000 EUR) balance
	mockSpendRepo.On("GetWorkspace", workspaceID).Return(&workspace.Workspace{
		ID:                 workspaceID,
		SaveToSpendBalance: 100000,
	}, nil)

	// Setup payment statuses - salary and rent both unpaid
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, month).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false}, // Salary pending
		{FixedCostID: 2, IsPaid: false}, // Rent pending
	}, nil)

	// Setup fixed costs: positive = income, negative = expense
	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Salary", Amount: 300000},  // +3000 EUR income
		{ID: 2, Name: "Rent", Amount: -150000},   // -1500 EUR expense
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	// No one-time costs
	mockSpendRepo.On("GetOneTimeCosts", workspaceID, month).Return([]spend.OneTimePendingCost{}, nil)

	safeToSpend, err := svc.CalculateSafeToSpend(workspaceID, month)

	assert.NoError(t, err)
	// 100000 + 300000 + (-150000) = 250000 (2500 EUR)
	// Salary adds to balance, rent reduces it
	assert.Equal(t, 250000, safeToSpend)
}

func TestGetPendingTotal_WithExpenses(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	svc := service.NewSpendService(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	month := types.YearMonth{Year: 2025, Month: 1}

	mockSpendRepo.On("GetPaymentStatuses", workspaceID, month).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false},
	}, nil)

	// Fixed cost with negative amount (expense)
	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: -135000}, // -1350 EUR expense
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	mockSpendRepo.On("GetOneTimeCosts", workspaceID, month).Return([]spend.OneTimePendingCost{}, nil)

	pendingTotal, err := svc.GetPendingTotal(workspaceID, month)

	assert.NoError(t, err)
	// Pending total is negative (net expenses)
	assert.Equal(t, -135000, pendingTotal)
}

func TestGetPendingTotal_WithMixedIncomeAndExpenses(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	svc := service.NewSpendService(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	month := types.YearMonth{Year: 2025, Month: 1}

	mockSpendRepo.On("GetPaymentStatuses", workspaceID, month).Return([]spend.MonthlyPaymentStatus{
		{FixedCostID: 1, IsPaid: false}, // Salary
		{FixedCostID: 2, IsPaid: false}, // Rent
	}, nil)

	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Salary", Amount: 300000},  // +3000 EUR income
		{ID: 2, Name: "Rent", Amount: -150000},   // -1500 EUR expense
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	mockSpendRepo.On("GetOneTimeCosts", workspaceID, month).Return([]spend.OneTimePendingCost{}, nil)

	pendingTotal, err := svc.GetPendingTotal(workspaceID, month)

	assert.NoError(t, err)
	// 300000 + (-150000) = 150000 (net income of 1500 EUR)
	assert.Equal(t, 150000, pendingTotal)
}

func TestEnsureInitialized_CreatesForAllValidCosts_FirstTime(t *testing.T) {
	mockSpendRepo := new(MockSpendRepository)
	mockCostRepo := new(MockCostRepository)
	svc := service.NewSpendService(mockSpendRepo, mockCostRepo)

	var workspaceID uint = 1
	month := types.YearMonth{Year: 2025, Month: 2}
	prevMonth := types.YearMonth{Year: 2025, Month: 1} // AddMonths(month, -1) for month 2

	// No records for current month
	mockSpendRepo.On("CountPaymentStatuses", workspaceID, month).Return(int64(0), nil)

	// No records for previous month either (first time user)
	mockSpendRepo.On("GetPaymentStatuses", workspaceID, prevMonth).Return([]spend.MonthlyPaymentStatus{}, nil)

	// Fixed costs - one valid for February, one not
	fixedCosts := []cost.FixedCost{
		{ID: 1, Name: "Rent", Amount: 100000, DueMonth: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}}, // Monthly
		{ID: 2, Name: "Insurance", Amount: 50000, DueMonth: []int{7}},                                 // July only
	}
	mockCostRepo.On("LoadFixedCosts", workspaceID).Return(&fixedCosts)

	// Only the monthly cost should be created (valid for February)
	mockSpendRepo.On("CreatePaymentStatus", mock.MatchedBy(func(s *spend.MonthlyPaymentStatus) bool {
		return s.FixedCostID == 1
	})).Return(nil).Once()

	err := svc.EnsureInitialized(workspaceID, month)

	assert.NoError(t, err)
	mockSpendRepo.AssertNumberOfCalls(t, "CreatePaymentStatus", 1)
}
