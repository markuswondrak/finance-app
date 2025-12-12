package api

import (
	"wondee/finance-app-backend/internal/storage"
)

// Server holds the repository dependencies
type Server struct {
	Repo storage.Repository
}

func NewServer(repo storage.Repository) *Server {
	return &Server{Repo: repo}
}
