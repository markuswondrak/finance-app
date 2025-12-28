package cost

import (
	"database/sql/driver"
	"strconv"
	"strings"
	"wondee/finance-app-backend/internal/platform/types"
)

type FixedCost struct {
	ID          int    `gorm:"primary_key"`
	UserID      uint   `json:"user_id"`
	WorkspaceID uint   `json:"workspace_id"`
	Name        string
	Amount      int
	From        *types.YearMonth
	To          *types.YearMonth
	DueMonth    Months `gorm:"type:string"`
	IsSaving    bool
}

type Months []int

var ALL_MONTHS = []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}

func (this *Months) Scan(value interface{}) error {
	str := value.(string)

	if len(str) == 0 {
		return nil
	}

	for _, month := range strings.Split(str, " ") {
		value, err := strconv.Atoi(month)
		if err == nil {
			*this = append(*this, value)
		}
	}

	return nil
}

func (this Months) Value() (driver.Value, error) {
	if this == nil {
		return nil, nil
	}

	var result string
	for i, month := range this {
		result += strconv.Itoa(month)

		if i != len(this) {
			result += " "
		}
	}

	return result, nil

}
