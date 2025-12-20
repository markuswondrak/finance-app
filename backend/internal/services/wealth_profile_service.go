package services

import (
	"errors"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
	"gorm.io/gorm"
)

type WealthProfileService struct {
	repo storage.WealthProfileRepository
}

func NewWealthProfileService(repo storage.WealthProfileRepository) *WealthProfileService {
	return &WealthProfileService{repo: repo}
}

func (s *WealthProfileService) GetProfile(userID uint) (*models.WealthProfile, error) {
	profile, err := s.repo.GetWealthProfile(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Return defaults
			return &models.WealthProfile{
				UserID:                userID,
				ForecastDurationYears: 10,
				RateWorstCase:         3.0,
				RateAverageCase:       5.0,
				RateBestCase:          7.0,
				CurrentWealth:         0.0,
			}, nil
		}
		return nil, err
	}
	return profile, nil
}

func (s *WealthProfileService) UpdateProfile(profile *models.WealthProfile) error {
	// Validation
	if profile.CurrentWealth < 0 {
		return errors.New("current wealth must be non-negative")
	}
	if profile.ForecastDurationYears < 1 || profile.ForecastDurationYears > 100 {
		return errors.New("duration must be between 1 and 100 years")
	}
	if !isValidRate(profile.RateWorstCase) || !isValidRate(profile.RateAverageCase) || !isValidRate(profile.RateBestCase) {
		return errors.New("rates must be between -20.0 and 100.0")
	}
	if profile.RateWorstCase > profile.RateAverageCase || profile.RateAverageCase > profile.RateBestCase {
		return errors.New("rates consistency error: worst <= average <= best")
	}

	return s.repo.UpsertWealthProfile(profile)
}

func isValidRate(rate float64) bool {
	return rate >= -20.0 && rate <= 100.0
}
