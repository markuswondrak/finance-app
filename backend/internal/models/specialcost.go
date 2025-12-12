package models

type SpecialCost struct {
	ID      int `gorm:primary_key`
	Name    string
	Amount  int
	DueDate *YearMonth
}
