package api

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/models"
)

type Response struct {

        CurrentBalance float64         `json:"currentBalance"`

        Monthly        []JsonFixedCost `json:"monthly"`

        Quarterly      []JsonFixedCost `json:"quarterly"`

        Halfyearly     []JsonFixedCost `json:"halfyearly"`

        Yearly         []JsonFixedCost `json:"yearly"`

}



type JsonFixedCost struct {

        ID       int               `json:"id"`

        Name     string            `json:"name"`

        Amount   int               `json:"amount"`

        From     *models.YearMonth `json:"from"`

        To       *models.YearMonth `json:"to"`

        DueMonth int               `json:"dueMonth"`

        IsSaving bool              `json:"isSaving"`

}



func (s *Server) GetFixedCosts(c *gin.Context) {

        userID := s.getUserID(c)

        c.IndentedJSON(http.StatusOK, s.createFixedCosts(userID))

}



func (s *Server) DeleteFixedCosts(c *gin.Context) {

        param := c.Param("id")

        id, err := strconv.Atoi(param)



        if err != nil {

                c.Status(http.StatusBadRequest)

                return

        }



        userID := s.getUserID(c)

        s.Repo.DeleteFixedCost(id, userID)

}



func (s *Server) SaveYearlyFixedCosts(c *gin.Context) {

        s.saveFixedCost(c, func(dueMonth int) ([]int, error) {

                if dueMonth < 0 || dueMonth > 12 {

                        return nil, errors.New("dueMonth for yearly must be between 1 and 12")

                }

                return []int{dueMonth}, nil

        })

}



func (s *Server) SaveHalfYearlyFixedCosts(c *gin.Context) {

        s.saveFixedCost(c, func(dueMonth int) ([]int, error) {

                if dueMonth < 0 || dueMonth > 6 {

                        return nil, errors.New("dueMonth for halfyearly must be between 1 and 6")

                }



                return []int{dueMonth, dueMonth + 6}, nil

        })

}



func (s *Server) SaveQuaterlyFixedCosts(c *gin.Context) {

        s.saveFixedCost(c, func(dueMonth int) ([]int, error) {

                if dueMonth < 0 || dueMonth > 3 {

                        return nil, errors.New("dueMonth for halfyearly must be between 1 and 3")

                }



                return []int{dueMonth, dueMonth + 3, dueMonth + 6, dueMonth + 9}, nil

        })

}



func (s *Server) SaveMonthlyFixedCosts(c *gin.Context) {

        s.saveFixedCost(c, func(_ int) ([]int, error) {

                return models.ALL_MONTHS, nil

        })

}



func (s *Server) saveFixedCost(c *gin.Context, dueMonthConverter func(int) ([]int, error)) {

        var cost JsonFixedCost

        err := c.ShouldBindJSON(&cost)



        if err != nil {

                c.Status(http.StatusBadRequest)

                return

        }



        dbObject, err := ToDBStruct(&cost, dueMonthConverter)



        if err != nil {

                c.Status(http.StatusBadRequest)

                return

        }



        dbObject.UserID = s.getUserID(c)

        s.Repo.SaveFixedObject(dbObject)

}



func (s *Server) createFixedCosts(userID uint) Response {



        costs := s.Repo.LoadFixedCosts(userID)

        totalAnnualBalance := 0

        currentYearMonth := models.CurrentYearMonth()



        monthly := make([]JsonFixedCost, 0)

        quaterly := make([]JsonFixedCost, 0)

        halfyearly := make([]JsonFixedCost, 0)

        yearly := make([]JsonFixedCost, 0)



        for _, cost := range *costs {

                if models.IsRelevant(currentYearMonth, cost.From, cost.To) {

                        totalAnnualBalance += (cost.Amount * len(cost.DueMonth))

                }



                switch month := len(cost.DueMonth); month {

                case 1:

                        yearly = append(yearly, ToJsonStruct(&cost))

                case 2:

                        halfyearly = append(halfyearly, ToJsonStruct(&cost))

                case 4:

                        quaterly = append(quaterly, ToJsonStruct(&cost))

                case 12:

                        monthly = append(monthly, ToJsonStruct(&cost))

                default:

                        panic("only 1, 2, 4 and 12 is valid, but was " + strconv.Itoa(month))

                }



        }



        return Response{

                CurrentBalance: float64(totalAnnualBalance) / 12.0,

                Monthly:        monthly,

                Quarterly:      quaterly,

                Halfyearly:     halfyearly,

                Yearly:         yearly,

        }

}

func ToJsonStruct(dbObject *models.FixedCost) JsonFixedCost {
	return JsonFixedCost{
		ID:       dbObject.ID,
		Name:     dbObject.Name,
		Amount:   dbObject.Amount,
		From:     dbObject.From,
		To:       dbObject.To,
		DueMonth: dbObject.DueMonth[0],
		IsSaving: dbObject.IsSaving,
	}
}

func ToDBStruct(
	jsonObject *JsonFixedCost,
	dueMonthCreator func(int) ([]int, error),
) (*models.FixedCost, error) {
	// Validation removed to support Wealth Extraction (IsSaving=true, Amount>0)

	value, err := dueMonthCreator(jsonObject.DueMonth)

	if err != nil {
		return nil, err
	}

	return &models.FixedCost{
		ID:       jsonObject.ID,
		Name:     jsonObject.Name,
		Amount:   jsonObject.Amount,
		From:     jsonObject.From,
		To:       jsonObject.To,
		DueMonth: value,
		IsSaving: jsonObject.IsSaving,
	}, nil
}
