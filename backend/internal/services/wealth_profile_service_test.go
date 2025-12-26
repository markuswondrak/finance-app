package services_test

import (
	"testing"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/services"
	"gorm.io/gorm"
)

// MockRepository
type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) GetWealthProfile(userID uint) (*models.WealthProfile, error) {
	args := m.Called(userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.WealthProfile), args.Error(1)
}

func (m *MockRepository) UpsertWealthProfile(profile *models.WealthProfile) error {
	args := m.Called(profile)
	return args.Error(0)
}

// Add other repository methods as needed for interface satisfaction (placeholders)
func (m *MockRepository) LoadFixedCosts(userID uint) *[]models.FixedCost { return nil }
func (m *MockRepository) SaveFixedObject(cost *models.FixedCost) {}
func (m *MockRepository) DeleteFixedCost(id int, userID uint) {}
func (m *MockRepository) LoadSpecialCosts(userID uint) *[]models.SpecialCost { return nil }
func (m *MockRepository) SaveSpecialCost(cost *models.SpecialCost) {}
func (m *MockRepository) DeleteSpecialCost(id int, userID uint) {}
func (m *MockRepository) GetUser() (*models.User, error) { return nil, nil }
func (m *MockRepository) UpdateUserCurrentAmount(amount int) error { return nil }
func (m *MockRepository) Create(user *models.User) error { return nil }
func (m *MockRepository) GetByEmail(email string) (*models.User, error) { return nil, nil }
func (m *MockRepository) GetByID(id uint) (*models.User, error) { return nil, nil }
func (m *MockRepository) Update(user *models.User) error { return nil }
func (m *MockRepository) Delete(id uint) error { return nil }

func TestGetWealthProfile_ReturnsDefaults_WhenNotFound(t *testing.T) {
	mockRepo := new(MockRepository)
	service := services.NewWealthProfileService(mockRepo)
	
	mockRepo.On("GetWealthProfile", uint(1)).Return(nil, gorm.ErrRecordNotFound)
	
	profile, err := service.GetProfile(1)
	
	assert.NoError(t, err)
	assert.NotNil(t, profile)
	// Defaults: 10y, 3%, 5%, 7%
	assert.Equal(t, 10, profile.ForecastDurationYears)
	assert.Equal(t, 3.0, profile.RateWorstCase)
	assert.Equal(t, 5.0, profile.RateAverageCase)
	assert.Equal(t, 7.0, profile.RateBestCase)
}

func TestUpdateProfile_ValidatesRanges(t *testing.T) {
	mockRepo := new(MockRepository)
	service := services.NewWealthProfileService(mockRepo)
	
	invalidProfile := &models.WealthProfile{
		UserID: 1,
		ForecastDurationYears: 150, // > 100
		CurrentWealth: 50000,
		RateWorstCase: 3,
		RateAverageCase: 5,
		RateBestCase: 7,
	}
	
	err := service.UpdateProfile(invalidProfile)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "duration")
}

func TestUpdateProfile_ValidatesConsistency(t *testing.T) {
	mockRepo := new(MockRepository)
	service := services.NewWealthProfileService(mockRepo)
	
	inconsistentProfile := &models.WealthProfile{
		UserID: 1,
		ForecastDurationYears: 10,
		CurrentWealth: 50000,
		RateWorstCase: 8,
		RateAverageCase: 5, // Worst > Average
		RateBestCase: 7,
	}
	
	err := service.UpdateProfile(inconsistentProfile)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "consistency")
}
