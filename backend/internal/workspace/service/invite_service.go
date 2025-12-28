package service

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"time"

	"wondee/finance-app-backend/internal/storage"
	"wondee/finance-app-backend/internal/workspace"
)

type InviteService struct {
	Repo         storage.Repository
	EmailService *EmailService
}

func NewInviteService(repo storage.Repository, emailService *EmailService) *InviteService {
	return &InviteService{Repo: repo, EmailService: emailService}
}

func (s *InviteService) GenerateToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func (s *InviteService) CreateInvite(workspaceID uint, inviterID uint, email string, inviterName string) (*workspace.Invite, error) {
	fmt.Printf("[InviteService] CreateInvite called for email: %s\n", email)
	token, err := s.GenerateToken()
	if err != nil {
		return nil, err
	}

	invite := &workspace.Invite{
		Token:       token,
		WorkspaceID: workspaceID,
		InvitedBy:   inviterID,
		Email:       email,
		ExpiresAt:   time.Now().Add(24 * time.Hour),
	}

	if err := s.Repo.CreateInvite(invite); err != nil {
		return nil, err
	}
    
    // Construct invite link - assuming frontend URL from config or hardcoded for now (TODO: pass config)
    // Defaulting to generic URL, should be updated with actual frontend URL
    inviteLink := fmt.Sprintf("https://finance.wondee.info/invite/%s", token)

	if s.EmailService != nil {
		if err := s.EmailService.SendInviteEmail(email, inviteLink, inviterName); err != nil {
			fmt.Printf("[InviteService] Failed to send invite email: %v\n", err)
		}
	} else {
		fmt.Println("[InviteService] EmailService is nil, skipping email")
	}

	return invite, nil
}

func (s *InviteService) ValidateInvite(token string) (*workspace.Invite, error) {
	invite, err := s.Repo.GetInviteByToken(token)
	if err != nil {
		return nil, err
	}

	if time.Now().After(invite.ExpiresAt) {
		return nil, fmt.Errorf("invite expired")
	}

	return invite, nil
}
