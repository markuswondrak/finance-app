package wealth

// ForecastPoint represents a single data point in the wealth forecast chart.
type ForecastPoint struct {
	Year     int     `json:"year"`
	Invested float64 `json:"invested"`
	Worst    float64 `json:"worst"`
	Average  float64 `json:"average"`
	Best     float64 `json:"best"`
}

// ForecastResponse represents the API response for wealth forecast.
type ForecastResponse struct {
	Points        []ForecastPoint `json:"points"`
	StartCapital  float64         `json:"start_capital"`
	MonthlySaving float64         `json:"monthly_saving"`
	DurationYears int             `json:"duration_years"`
}
