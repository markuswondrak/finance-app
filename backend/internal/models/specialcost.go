package models

type SpecialCost struct {
	ID          int    `gorm:"primary_key"`
	UserID      uint   `json:"user_id"`
	WorkspaceID uint   `json:"workspace_id"`
	Name        string
	Amount      int
	DueDate     *YearMonth
	IsSaving    bool
}
