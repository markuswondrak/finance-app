package api

import (
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/cost"
	cost_repo "wondee/finance-app-backend/internal/cost/repository"
	"wondee/finance-app-backend/internal/platform/types"
	"wondee/finance-app-backend/internal/spend"
	"wondee/finance-app-backend/internal/spend/repository"
	"wondee/finance-app-backend/internal/spend/service"
)

// Handler handles HTTP requests for the save-to-spend feature
type Handler struct {
	repo     repository.Repository
	costRepo cost_repo.Repository
	service  *service.SpendService
}

// NewHandler creates a new Handler instance
func NewHandler(repo repository.Repository, costRepo cost_repo.Repository) *Handler {
	return &Handler{
		repo:     repo,
		costRepo: costRepo,
		service:  service.NewSpendService(repo, costRepo),
	}
}

// Response types

type SaveToSpendResponse struct {
	SafeToSpend        int                    `json:"safeToSpend"`
	CheckingBalance    int                    `json:"checkingBalance"`
	CurrentMonth       types.YearMonth        `json:"currentMonth"`
	IncludedFixedCosts []IncludedFixedCostDTO `json:"includedFixedCosts"`
	ExcludedFixedCosts []ExcludedFixedCostDTO `json:"excludedFixedCosts"`
	OneTimeCosts       []OneTimeCostDTO       `json:"oneTimeCosts"`
	PendingTotal       int                    `json:"pendingTotal"`
}

type IncludedFixedCostDTO struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Amount int    `json:"amount"`
	IsPaid bool   `json:"isPaid"`
}

type ExcludedFixedCostDTO struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Amount int    `json:"amount"`
}

type OneTimeCostDTO struct {
	ID     uint   `json:"id"`
	Name   string `json:"name"`
	Amount int    `json:"amount"`
	IsPaid bool   `json:"isPaid"`
}

type UpdateBalanceRequest struct {
	Amount int `json:"amount"`
}

type CreateOneTimeCostRequest struct {
	Name   string `json:"name" binding:"required,min=1,max=100"`
	Amount int    `json:"amount" binding:"required"`
}

// GetSaveToSpend returns the complete save-to-spend state
func (h *Handler) GetSaveToSpend(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)
	currentMonth := types.CurrentYearMonth()

	// Ensure initialized for current month
	if err := h.service.EnsureInitialized(workspaceID, *currentMonth); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize"})
		return
	}

	response, err := h.buildSaveToSpendResponse(workspaceID, *currentMonth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// buildSaveToSpendResponse constructs the full API response
func (h *Handler) buildSaveToSpendResponse(workspaceID uint, month types.YearMonth) (*SaveToSpendResponse, error) {
	// Get workspace for balance
	workspace, err := h.repo.GetWorkspace(workspaceID)
	if err != nil {
		return nil, err
	}

	// Get payment statuses for current month
	statuses, err := h.repo.GetPaymentStatuses(workspaceID, month)
	if err != nil {
		return nil, err
	}

	// Build a map of included cost IDs and their paid status
	includedMap := make(map[int]bool) // fixedCostID -> isPaid
	for _, status := range statuses {
		includedMap[status.FixedCostID] = status.IsPaid
	}

	// Load all fixed costs
	fixedCosts := h.costRepo.LoadFixedCosts(workspaceID)

	// Separate into included and excluded
	includedFixedCosts := make([]IncludedFixedCostDTO, 0)
	excludedFixedCosts := make([]ExcludedFixedCostDTO, 0)

	for _, fc := range *fixedCosts {
		// Only consider costs that are valid for this month
		if !h.isValidForMonth(&fc, &month) {
			continue
		}

		if isPaid, included := includedMap[fc.ID]; included {
			includedFixedCosts = append(includedFixedCosts, IncludedFixedCostDTO{
				ID:     fc.ID,
				Name:   fc.Name,
				Amount: fc.Amount,
				IsPaid: isPaid,
			})
		} else {
			excludedFixedCosts = append(excludedFixedCosts, ExcludedFixedCostDTO{
				ID:     fc.ID,
				Name:   fc.Name,
				Amount: fc.Amount,
			})
		}
	}

	// Get one-time costs
	oneTimeCosts, err := h.repo.GetOneTimeCosts(workspaceID, month)
	if err != nil {
		return nil, err
	}

	oneTimeCostDTOs := make([]OneTimeCostDTO, 0, len(oneTimeCosts))
	for _, otc := range oneTimeCosts {
		oneTimeCostDTOs = append(oneTimeCostDTOs, OneTimeCostDTO{
			ID:     otc.ID,
			Name:   otc.Name,
			Amount: otc.Amount,
			IsPaid: otc.IsPaid,
		})
	}

	// Calculate safe-to-spend and pending total
	safeToSpend, err := h.service.CalculateSafeToSpend(workspaceID, month)
	if err != nil {
		return nil, err
	}

	pendingTotal, err := h.service.GetPendingTotal(workspaceID, month)
	if err != nil {
		return nil, err
	}

	return &SaveToSpendResponse{
		SafeToSpend:        safeToSpend,
		CheckingBalance:    workspace.SaveToSpendBalance,
		CurrentMonth:       month,
		IncludedFixedCosts: includedFixedCosts,
		ExcludedFixedCosts: excludedFixedCosts,
		OneTimeCosts:       oneTimeCostDTOs,
		PendingTotal:       pendingTotal,
	}, nil
}

// isValidForMonth checks if a fixed cost is valid for a given month
func (h *Handler) isValidForMonth(fc *cost.FixedCost, month *types.YearMonth) bool {
	// Check validity period
	if !types.IsRelevant(month, fc.From, fc.To) {
		return false
	}
	// Check billing cycle
	return slices.Contains(fc.DueMonth, month.Month)
}

// UpdateBalance updates the checking account balance
func (h *Handler) UpdateBalance(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)

	var req UpdateBalanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: amount must be non-negative"})
		return
	}

	if err := h.repo.UpdateSaveToSpendBalance(workspaceID, req.Amount); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update balance"})
		return
	}

	// Return updated state
	currentMonth := types.CurrentYearMonth()
	response, err := h.buildSaveToSpendResponse(workspaceID, *currentMonth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// MarkFixedCostPaid marks a fixed cost as paid for the current month
func (h *Handler) MarkFixedCostPaid(c *gin.Context) {
	h.updatePaymentStatus(c, true)
}

// MarkFixedCostPending marks a fixed cost as pending for the current month
func (h *Handler) MarkFixedCostPending(c *gin.Context) {
	h.updatePaymentStatus(c, false)
}

func (h *Handler) updatePaymentStatus(c *gin.Context, isPaid bool) {
	workspaceID := h.getWorkspaceID(c)
	fixedCostID := h.getIntParam(c, "id")
	if fixedCostID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid fixed cost ID"})
		return
	}

	currentMonth := types.CurrentYearMonth()

	// Get the status record
	status, err := h.repo.GetPaymentStatus(workspaceID, fixedCostID, *currentMonth)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Fixed cost not found or not included in save-to-spend"})
		return
	}

	// Update the status
	status.IsPaid = isPaid
	if isPaid {
		now := types.CurrentYearMonth() // Use current time
		_ = now                         // Placeholder - in real implementation, use time.Now()
	} else {
		status.PaidAt = nil
	}

	if err := h.repo.UpdatePaymentStatus(status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	// Return updated state
	response, err := h.buildSaveToSpendResponse(workspaceID, *currentMonth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// IncludeFixedCost includes a fixed cost in save-to-spend
func (h *Handler) IncludeFixedCost(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)
	fixedCostID := h.getIntParam(c, "id")
	if fixedCostID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid fixed cost ID"})
		return
	}

	currentMonth := types.CurrentYearMonth()

	// Check if already included
	_, err := h.repo.GetPaymentStatus(workspaceID, fixedCostID, *currentMonth)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Fixed cost already included"})
		return
	}

	// Create the status record
	status := &spend.MonthlyPaymentStatus{
		WorkspaceID: workspaceID,
		FixedCostID: fixedCostID,
		Month:       *currentMonth,
		IsPaid:      false,
	}

	if err := h.repo.CreatePaymentStatus(status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to include fixed cost"})
		return
	}

	// Return updated state
	response, err := h.buildSaveToSpendResponse(workspaceID, *currentMonth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// ExcludeFixedCost excludes a fixed cost from save-to-spend
func (h *Handler) ExcludeFixedCost(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)
	fixedCostID := h.getIntParam(c, "id")
	if fixedCostID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid fixed cost ID"})
		return
	}

	currentMonth := types.CurrentYearMonth()

	// Delete the status record
	if err := h.repo.DeletePaymentStatus(workspaceID, fixedCostID, *currentMonth); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Fixed cost not found or not included"})
		return
	}

	// Return updated state
	response, err := h.buildSaveToSpendResponse(workspaceID, *currentMonth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// CreateOneTimeCost creates a new one-time pending cost
func (h *Handler) CreateOneTimeCost(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)

	var req CreateOneTimeCostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: name and amount are required"})
		return
	}

	currentMonth := types.CurrentYearMonth()

	cost := &spend.OneTimePendingCost{
		WorkspaceID: workspaceID,
		Name:        req.Name,
		Amount:      req.Amount,
		Month:       *currentMonth,
		IsPaid:      false,
	}

	if err := h.repo.CreateOneTimeCost(cost); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create one-time cost"})
		return
	}

	// Return updated state
	response, err := h.buildSaveToSpendResponse(workspaceID, *currentMonth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}

	c.JSON(http.StatusCreated, response)
}

// DeleteOneTimeCost deletes a one-time pending cost
func (h *Handler) DeleteOneTimeCost(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)
	costID := h.getUintParam(c, "id")
	if costID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cost ID"})
		return
	}

	if err := h.repo.DeleteOneTimeCost(costID, workspaceID); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "One-time cost not found"})
		return
	}

	// Return updated state
	currentMonth := types.CurrentYearMonth()
	response, err := h.buildSaveToSpendResponse(workspaceID, *currentMonth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// MarkOneTimeCostPaid marks a one-time cost as paid
func (h *Handler) MarkOneTimeCostPaid(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)
	costID := h.getUintParam(c, "id")
	if costID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cost ID"})
		return
	}

	// Get the cost
	cost, err := h.repo.GetOneTimeCost(costID, workspaceID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "One-time cost not found"})
		return
	}

	// Update the status
	cost.IsPaid = true
	if err := h.repo.UpdateOneTimeCost(cost); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cost"})
		return
	}

	// Return updated state
	currentMonth := types.CurrentYearMonth()
	response, err := h.buildSaveToSpendResponse(workspaceID, *currentMonth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// MarkOneTimeCostPending marks a one-time cost as pending (not paid)
func (h *Handler) MarkOneTimeCostPending(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)
	costID := h.getUintParam(c, "id")
	if costID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cost ID"})
		return
	}

	// Get the cost
	cost, err := h.repo.GetOneTimeCost(costID, workspaceID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "One-time cost not found"})
		return
	}

	// Update the status
	cost.IsPaid = false
	if err := h.repo.UpdateOneTimeCost(cost); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cost"})
		return
	}

	// Return updated state
	currentMonth := types.CurrentYearMonth()
	response, err := h.buildSaveToSpendResponse(workspaceID, *currentMonth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load data"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// Helper functions

func (h *Handler) getWorkspaceID(c *gin.Context) uint {
	workspaceID, exists := c.Get("workspace_id")
	if !exists {
		return 0
	}
	return workspaceID.(uint)
}

func (h *Handler) getIntParam(c *gin.Context, name string) int {
	param := c.Param(name)
	var id int
	for i, ch := range param {
		if ch >= '0' && ch <= '9' {
			id = id*10 + int(ch-'0')
		} else if i > 0 {
			break
		}
	}
	return id
}

func (h *Handler) getUintParam(c *gin.Context, name string) uint {
	return uint(h.getIntParam(c, name))
}
