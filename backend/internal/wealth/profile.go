package wealth

import (
	"time"
	"wondee/finance-app-backend/internal/user"
)

type WealthProfile struct {
	ID                    uint    `json:"id" gorm:"primaryKey"`
	UserID                uint    `json:"user_id" gorm:"not null"` // Kept for history, but not unique anymore
	WorkspaceID           uint    `json:"workspace_id" gorm:"not null;index"` // Wealth is now per workspace
	User                  user.User `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CurrentWealth         float64 `json:"current_wealth" gorm:"type:decimal(15,2);not null;default:0"`
	ForecastDurationYears int     `json:"forecast_duration_years" gorm:"not null;check:forecast_duration_years > 0"`
	RateWorstCase         float64 `json:"rate_worst_case" gorm:"type:decimal(5,2);not null"`
	RateAverageCase       float64 `json:"rate_average_case" gorm:"type:decimal(5,2);not null"`
	RateBestCase          float64 `json:"rate_best_case" gorm:"type:decimal(5,2);not null"`
	CreatedAt             time.Time `json:"created_at"`
	UpdatedAt             time.Time `json:"updated_at"`
}
