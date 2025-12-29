package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"wondee/finance-app-backend/internal/storage"
	user_service "wondee/finance-app-backend/internal/user/service"
	"wondee/finance-app-backend/internal/workspace/service"
)

type Handler struct {
	Repo             storage.Repository
	WorkspaceService *service.WorkspaceService
	InviteService    *service.InviteService
	UserService      *user_service.UserService
}

func (h *Handler) getUserID(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}

func (h *Handler) getWorkspaceID(c *gin.Context) uint {
	workspaceID, exists := c.Get("workspace_id")
	if !exists {
		return 0
	}
	return workspaceID.(uint)
}

func (h *Handler) InviteMember(c *gin.Context) {
	userID := h.getUserID(c)
	workspaceID := h.getWorkspaceID(c)
	if workspaceID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Workspace ID not found in context"})
		return
	}

	var req struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	inviter, err := h.Repo.GetByID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get inviter info"})
		return
	}

	invite, err := h.InviteService.CreateInvite(workspaceID, userID, req.Email, inviter.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, invite)
}

func (h *Handler) JoinWorkspace(c *gin.Context) {
	userID := h.getUserID(c)

	var req struct {
		Token string `json:"token" binding:"required"`
		Force bool   `json:"force"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	invite, err := h.InviteService.ValidateInvite(req.Token)
	if err != nil {
		if err.Error() == "invite expired" {
			c.JSON(http.StatusGone, gin.H{
				"error": "This invite has expired",
				"code":  "INVITE_EXPIRED",
			})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired invite"})
		return
	}

	// Check for existing data
	hasData, err := h.UserService.HasExistingData(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check existing data"})
		return
	}

	if hasData && !req.Force {
		c.JSON(http.StatusConflict, gin.H{
			"error":   "User has existing data",
			"warning": "Joining a workspace will permanently delete your existing personal data. Confirm to proceed.",
			"code":    "EXISTING_DATA",
		})
		return
	}

	if hasData && req.Force {
		if err := h.WorkspaceService.PurgeUserData(userID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to purge data"})
			return
		}
	}

	// Update User to new workspace
	user, err := h.Repo.GetByID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
		return
	}

	user.WorkspaceID = invite.WorkspaceID
	if err := h.Repo.Update(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user workspace"})
		return
	}

	// Mark invite used
	invite.IsUsed = true
	if err := h.Repo.UpdateInvite(invite); err != nil {
		// Log error but don't fail request as user is already joined
	}

	c.JSON(http.StatusOK, gin.H{"message": "Joined workspace successfully", "workspace_id": invite.WorkspaceID})
}

func (h *Handler) GetWorkspace(c *gin.Context) {
	workspaceID := h.getWorkspaceID(c)
	workspace, err := h.WorkspaceService.GetWorkspace(workspaceID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Workspace not found"})
		return
	}
	c.JSON(http.StatusOK, workspace)
}

func (h *Handler) DeclineInvite(c *gin.Context) {
	var req struct {
		Token string `json:"token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	invite, err := h.InviteService.ValidateInvite(req.Token)
	if err != nil {
		// Even if expired or invalid, we don't care - just acknowledge
		c.JSON(http.StatusOK, gin.H{"message": "Invite declined"})
		return
	}

	// Mark invite as used so it can't be used again
	invite.IsUsed = true
	h.Repo.UpdateInvite(invite)

	c.JSON(http.StatusOK, gin.H{"message": "Invite declined"})
}

func (h *Handler) RemoveMember(c *gin.Context) {
	memberIDStr := c.Param("id")
	memberID, err := strconv.Atoi(memberIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid member ID"})
		return
	}

	requestingUserID := h.getUserID(c)
	workspaceID := h.getWorkspaceID(c)

	if err := h.WorkspaceService.RemoveMember(uint(memberID), workspaceID, requestingUserID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}
