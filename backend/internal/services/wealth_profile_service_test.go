package services_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/services"
)

// MockWealthProfileRepository implements storage.WealthProfileRepository for testing
type MockWealthProfileRepository struct {
	mock.Mock
}

func (m *MockWealthProfileRepository) GetWealthProfile(workspaceID uint) (*models.WealthProfile, error) {
	args := m.Called(workspaceID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.WealthProfile), args.Error(1)
}

func (m *MockWealthProfileRepository) UpsertWealthProfile(profile *models.WealthProfile) error {
	args := m.Called(profile)
	return args.Error(0)
}

func TestGetWealthProfile_ReturnsDefaults_WhenNotFound(t *testing.T) {
	mockRepo := new(MockWealthProfileRepository)
	service := services.NewWealthProfileService(mockRepo)

	var workspaceID uint = 1
	mockRepo.On("GetWealthProfile", workspaceID).Return(nil, gorm.ErrRecordNotFound)

	profile, err := service.GetProfile(workspaceID)

	assert.NoError(t, err)
	assert.NotNil(t, profile)
	// Defaults: 10y, 3%, 5%, 7%
	assert.Equal(t, 10, profile.ForecastDurationYears)
	assert.Equal(t, 3.0, profile.RateWorstCase)
	assert.Equal(t, 5.0, profile.RateAverageCase)
	assert.Equal(t, 7.0, profile.RateBestCase)
}

func TestUpdateProfile_ValidatesRanges(t *testing.T) {
	mockRepo := new(MockWealthProfileRepository)
	service := services.NewWealthProfileService(mockRepo)

	invalidProfile := &models.WealthProfile{
		UserID:                1,
		WorkspaceID:           1,
		ForecastDurationYears: 150, // > 100
		CurrentWealth:         50000,
		RateWorstCase:         3,
		RateAverageCase:       5,
		RateBestCase:          7,
	}

	err := service.UpdateProfile(invalidProfile)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "duration")
}

func TestUpdateProfile_ValidatesConsistency(t *testing.T) {
	mockRepo := new(MockWealthProfileRepository)
	service := services.NewWealthProfileService(mockRepo)

	inconsistentProfile := &models.WealthProfile{
		UserID:                1,
		WorkspaceID:           1,
		ForecastDurationYears: 10,
		CurrentWealth:         50000,
		RateWorstCase:         8,
		RateAverageCase:       5, // Worst > Average
		RateBestCase:          7,
	}

	err := service.UpdateProfile(inconsistentProfile)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "consistency")
}
