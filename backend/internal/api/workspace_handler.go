package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (s *Server) InviteMember(c *gin.Context) {
	userID := s.getUserID(c)
	workspaceID := s.getWorkspaceID(c)
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

	inviter, err := s.Repo.GetByID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get inviter info"})
		return
	}

	invite, err := s.InviteService.CreateInvite(workspaceID, userID, req.Email, inviter.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, invite)
}

func (s *Server) JoinWorkspace(c *gin.Context) {
	userID := s.getUserID(c)

	var req struct {
		Token string `json:"token" binding:"required"`
		Force bool   `json:"force"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	invite, err := s.InviteService.ValidateInvite(req.Token)
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
	hasData, err := s.UserService.HasExistingData(userID)
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
		if err := s.WorkspaceService.PurgeUserData(userID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to purge data"})
			return
		}
	}

	// Update User to new workspace
	user, err := s.Repo.GetByID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
		return
	}

	user.WorkspaceID = invite.WorkspaceID
	if err := s.Repo.Update(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user workspace"})
		return
	}

	// Mark invite used
	invite.IsUsed = true
	if err := s.Repo.UpdateInvite(invite); err != nil {
		// Log error but don't fail request as user is already joined
	}

	c.JSON(http.StatusOK, gin.H{"message": "Joined workspace successfully", "workspace_id": invite.WorkspaceID})
}

func (s *Server) GetWorkspace(c *gin.Context) {
	workspaceID := s.getWorkspaceID(c)
	workspace, err := s.WorkspaceService.GetWorkspace(workspaceID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Workspace not found"})
		return
	}
	c.JSON(http.StatusOK, workspace)
}

func (s *Server) RemoveMember(c *gin.Context) {
	memberIDStr := c.Param("id")
	memberID, err := strconv.Atoi(memberIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid member ID"})
		return
	}

	requestingUserID := s.getUserID(c)
	workspaceID := s.getWorkspaceID(c)

	if err := s.WorkspaceService.RemoveMember(uint(memberID), workspaceID, requestingUserID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}
