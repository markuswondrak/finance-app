package models

type SurplusPoint struct {
	Month     string  `json:"month"` // Format: "YYYY-MM"
	Surplus   float64 `json:"surplus"`
	Projected bool    `json:"projected"`
}

type SurplusStatistics struct {
	CurrentSurplus  float64        `json:"current_surplus"`
	MonthlyIncome   float64        `json:"monthly_income"`
	MonthlyExpenses float64        `json:"monthly_expenses"`
	History         []SurplusPoint `json:"history"`
}
