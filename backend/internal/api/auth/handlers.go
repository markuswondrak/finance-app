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

func (h *AuthHandler) Login(c *gin.Context) {
	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	c.SetCookie("oauth_state", state, 300, "/", "", false, true)
	url := h.OAuthConfig.AuthCodeURL(state)
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
	token, err := h.OAuthConfig.Exchange(context.Background(), code)
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

	// Create or Update User
	user, err := h.Repo.GetByEmail(googleUser.Email)
	if err != nil {
		// Assume error means user not found (simplified) or generic DB error.
		// In a robust app, verify specific error type.
		// Create new user
		user = &models.User{
			GoogleID:  googleUser.ID,
			Email:     googleUser.Email,
			Name:      googleUser.Name,
			AvatarURL: googleUser.Picture,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		if err := h.Repo.Create(user); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
	} else {
		// Update existing user info
		user.Name = googleUser.Name
		user.AvatarURL = googleUser.Picture
		user.UpdatedAt = time.Now()
		h.Repo.Update(user)
	}

	// Generate JWT
	secret := os.Getenv("JWT_SECRET")
	tokenString, err := GenerateJWT(user.ID, secret, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Set Cookie
	// Name, Value, MaxAge, Path, Domain, Secure, HttpOnly
	c.SetCookie("auth_token", tokenString, 3600*24, "/", "", false, true) // Secure=false for dev

	// Redirect to frontend
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:8080"
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
	// TODO: Implement Logout
	c.JSON(http.StatusOK, gin.H{"message": "Logout"})
}
