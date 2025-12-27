package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"wondee/finance-app-backend/internal/models"
	"wondee/finance-app-backend/internal/storage"
)

type AuthHandler struct {
	Repo        storage.Repository
	OAuthConfig *oauth2.Config
}

type GoogleUser struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
}

func NewAuthHandler(repo storage.Repository) *AuthHandler {
	config := &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	return &AuthHandler{
		Repo:        repo,
		OAuthConfig: config,
	}
}

func (h *AuthHandler) getOAuthConfig(c *gin.Context) *oauth2.Config {
	config := *h.OAuthConfig // Shallow copy

	host := c.Request.Header.Get("X-Forwarded-Host")
	if host == "" {
		host = c.Request.Host
	}

	scheme := c.Request.Header.Get("X-Forwarded-Proto")
	if scheme == "" {
		if c.Request.TLS != nil {
			scheme = "https"
		} else {
			scheme = "http"
		}
	}

	config.RedirectURL = fmt.Sprintf("%s://%s/auth/google/callback", scheme, host)
	return &config
}

func (h *AuthHandler) Login(c *gin.Context) {
	// Check for invite token in query
	inviteToken := c.Query("invite_token")
	if inviteToken != "" {
		// Store invite token in cookie for retrieval in callback
		c.SetCookie("pending_invite_token", inviteToken, 600, "/", "", false, true)
	}

	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	c.SetCookie("oauth_state", state, 300, "/", "", false, true)
	
	config := h.getOAuthConfig(c)
	url := config.AuthCodeURL(state)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *AuthHandler) Callback(c *gin.Context) {
	oauthState, err := c.Cookie("oauth_state")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid state cookie"})
		return
	}

	if c.Query("state") != oauthState {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid state parameter"})
		return
	}

	code := c.Query("code")
	config := h.getOAuthConfig(c)
	token, err := config.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Code exchange failed"})
		return
	}

	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info"})
		return
	}
	defer resp.Body.Close()

	content, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read user info"})
		return
	}

	var googleUser GoogleUser
	if err := json.Unmarshal(content, &googleUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse user info"})
		return
	}

	// Retrieve pending invite token if any
	inviteToken, _ := c.Cookie("pending_invite_token")
	// Clear the cookie immediately
	c.SetCookie("pending_invite_token", "", -1, "/", "", false, true)

	// Create or Update User
	user, err := h.Repo.GetByEmail(googleUser.Email)
	if err != nil {
		var workspaceID uint
		
		// Check if we have a valid invite
		if inviteToken != "" {
			invite, err := h.Repo.GetInviteByToken(inviteToken)
			if err == nil && time.Now().Before(invite.ExpiresAt) {
				// Use the invited workspace
				workspaceID = invite.WorkspaceID
				
				// Mark invite as used
				invite.IsUsed = true
				h.Repo.UpdateInvite(invite)
			}
		}

		// If no valid invite, create a new workspace
		if workspaceID == 0 {
			workspace := &models.Workspace{
				Name: fmt.Sprintf("%s's Workspace", googleUser.Name),
			}
			if err := h.Repo.CreateWorkspace(workspace); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create workspace"})
				return
			}
			workspaceID = workspace.ID
		}

		// Create new user
		user = &models.User{
			GoogleID:    googleUser.ID,
			Email:       googleUser.Email,
			Name:        googleUser.Name,
			AvatarURL:   googleUser.Picture,
			WorkspaceID: workspaceID,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}
		if err := h.Repo.Create(user); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}

		// Create default wealth profile for new user ONLY if they created their own workspace
		// If they joined a workspace, they might not need a default profile immediately, 
		// or we can create one linked to that workspace if not exists.
		// For now, let's create it to be safe, but link to the workspaceID.
		defaultProfile := &models.WealthProfile{
			UserID:                user.ID,
			WorkspaceID:           workspaceID,
			ForecastDurationYears: 10,
			RateWorstCase:         3.0,
			RateAverageCase:       5.0,
			RateBestCase:          7.0,
			CurrentWealth:         0.0,
			CreatedAt:             time.Now(),
			UpdatedAt:             time.Now(),
		}
		if err := h.Repo.UpsertWealthProfile(defaultProfile); err != nil {
			// Log warning but continue login
			fmt.Printf("Warning: Failed to create default wealth profile for user %d: %v\n", user.ID, err)
		}
	} else {
		// Update existing user info
		user.Name = googleUser.Name
		user.AvatarURL = googleUser.Picture
		user.UpdatedAt = time.Now()
		
		// Ensure user has a workspace (migration fallback)
		if user.WorkspaceID == 0 {
			workspace := &models.Workspace{
				Name: fmt.Sprintf("%s's Workspace", user.Name),
			}
			if err := h.Repo.CreateWorkspace(workspace); err == nil {
				user.WorkspaceID = workspace.ID
			}
		}

		h.Repo.Update(user)
	}

	// Generate JWT
	secret := os.Getenv("JWT_SECRET")
	tokenString, err := GenerateJWT(user.ID, user.WorkspaceID, secret, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Set Cookie
	// Name, Value, MaxAge, Path, Domain, Secure, HttpOnly
	c.SetCookie("auth_token", tokenString, 3600*24, "/", "", false, true) // Secure=false for dev

	// Redirect to frontend
	host := c.Request.Header.Get("X-Forwarded-Host")
	if host == "" {
		host = c.Request.Host
	}

	scheme := c.Request.Header.Get("X-Forwarded-Proto")
	if scheme == "" {
		if c.Request.TLS != nil {
			scheme = "https"
		} else {
			scheme = "http"
		}
	}

	frontendURL := fmt.Sprintf("%s://%s", scheme, host)
	if os.Getenv("FRONTEND_URL") != "" {
		frontendURL = os.Getenv("FRONTEND_URL")
	}
	c.Redirect(http.StatusTemporaryRedirect, frontendURL+"/overview")
}

func (h *AuthHandler) Me(c *gin.Context) {
	cookie, err := c.Cookie("auth_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No auth cookie"})
		return
	}

	secret := os.Getenv("JWT_SECRET")
	claims, err := ValidateJWT(cookie, secret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	user, err := h.Repo.GetByID(claims.UserID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	c.SetCookie("auth_token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}
