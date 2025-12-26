package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type UpdateUserRequest struct {
	Amount *int `json:"amount" binding:"required"`
}

func (s *Server) UpdateCurrentAmount(c *gin.Context) {
	var req UpdateUserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	userID := s.getUserID(c)
	user, err := s.Repo.GetByID(userID)
	if err != nil {
		c.Status(http.StatusUnauthorized)
		return
	}

	user.CurrentAmount = *req.Amount
	err = s.Repo.Update(user)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

		c.JSON(http.StatusOK, gin.H{"amount": *req.Amount})

	}

	

	func (s *Server) DeleteCurrentUser(c *gin.Context) {

		userID := s.getUserID(c)

		if userID == 0 {

			c.Status(http.StatusUnauthorized)

			return

		}

	

		err := s.Repo.Delete(userID)

		if err != nil {

			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})

			return

		}

	

		c.Status(http.StatusNoContent)

	}

	