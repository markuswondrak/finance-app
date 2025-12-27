package services

import (
	"bytes"
	"fmt"
	"html/template"
	"os"

	"github.com/mailjet/mailjet-apiv3-go/v3"
)

type EmailService struct {
	Client    *mailjet.Client
	FromEmail string
	FromName  string
}

func NewEmailService() *EmailService {
	apiKey := os.Getenv("MAILJET_API_KEY")
	secretKey := os.Getenv("MAILJET_SECRET_KEY")
	fromEmail := os.Getenv("MAILJET_FROM_EMAIL")
	fromName := os.Getenv("MAILJET_FROM_NAME")

	if apiKey == "" || secretKey == "" {
		fmt.Println("Warning: MAILJET_API_KEY or MAILJET_SECRET_KEY not set. Email service will not function.")
		return nil
	}

	if fromEmail == "" {
		fromEmail = "noreply-invite@wondee.info"
	}
	if fromName == "" {
		fromName = "Finance App"
	}

	client := mailjet.NewMailjetClient(apiKey, secretKey)

	return &EmailService{
		Client:    client,
		FromEmail: fromEmail,
		FromName:  fromName,
	}
}

func (s *EmailService) SendInviteEmail(toEmail string, inviteLink string, senderName string) error {
	// Try to locate template file
	templatePaths := []string{
		"templates/invite_email.html",
		"../templates/invite_email.html",
		"../../templates/invite_email.html",
	}

	var templatePath string
	for _, path := range templatePaths {
		if _, err := os.Stat(path); err == nil {
			templatePath = path
			break
		}
	}

	if templatePath == "" {
		cwd, _ := os.Getwd()
		return fmt.Errorf("invite_email.html template not found. CWD: %s", cwd)
	}

	t, err := template.ParseFiles(templatePath)
	if err != nil {
		return fmt.Errorf("failed to parse template: %w", err)
	}

	var body bytes.Buffer
	data := struct {
		SenderName string
		InviteLink string
	}{
		SenderName: senderName,
		InviteLink: inviteLink,
	}

	if err := t.Execute(&body, data); err != nil {
		return fmt.Errorf("failed to execute template: %w", err)
	}

	messages := mailjet.MessagesV31{
		Info: []mailjet.InfoMessagesV31{
			{
				From: &mailjet.RecipientV31{
					Email: s.FromEmail,
					Name:  s.FromName,
				},
				To: &mailjet.RecipientsV31{
					mailjet.RecipientV31{
						Email: toEmail,
					},
				},
				Subject:  "Einladung zum Finanz-Workspace",
				HTMLPart: body.String(),
			},
		},
	}

	res, err := s.Client.SendMailV31(&messages)
	if err != nil {
		fmt.Printf("[EmailService] Mailjet error: %v\n", err)
		return fmt.Errorf("failed to send email: %w", err)
	}
	fmt.Printf("[EmailService] Mailjet response: %+v\n", res)
	return nil
}
