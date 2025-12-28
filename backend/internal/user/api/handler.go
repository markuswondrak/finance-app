package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/storage"
)

type Handler struct {
	Repo storage.Repository
}

type UpdateUserRequest struct {
	Amount *int `json:"amount" binding:"required"`
}

func (h *Handler) getUserID(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}

func (h *Handler) UpdateCurrentAmount(c *gin.Context) {
	var req UpdateUserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	userID := h.getUserID(c)
	user, err := h.Repo.GetByID(userID)
	if err != nil {
		c.Status(http.StatusUnauthorized)
		return
	}

	user.CurrentAmount = *req.Amount
	err = h.Repo.Update(user)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, gin.H{"amount": *req.Amount})
}

func (h *Handler) DeleteCurrentUser(c *gin.Context) {
	userID := h.getUserID(c)

	if userID == 0 {
		c.Status(http.StatusUnauthorized)
		return
	}

	err := h.Repo.Delete(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.Status(http.StatusNoContent)
}
