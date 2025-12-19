# Finance App

A modern personal finance tracking application built with Vue.js 3 and Go. It helps users manage fixed costs, track special expenses, and visualize financial forecasts with a fintech-inspired dark theme.

## Features

- **Fintech Dashboard:** High-level overview of current balance, monthly surplus, and risk indicators.
- **Fixed Costs Management:** Track recurring expenses (monthly, quarterly, half-yearly, yearly).
- **Special Costs Tracking:** Manage one-time or irregular expenses.
- **Financial Forecasting:** Visual sparklines and charts for surplus trends and balance projections.
- **Google Authentication:** Secure login using Google OAuth2.
- **Dark Theme:** Modern, high-contrast UI designed for readability.
- **Responsive Design:** Optimized for various screen sizes using Vuetify 3.

## Setup Guide

### Prerequisites

- **Frontend:** Node.js (v20+) and `pnpm` (v9+).
- **Backend:** Go (v1.24+) and Podman (or Docker) for the database.

### Database Setup

1. Navigate to the backend database directory:
   ```bash
   cd backend/db
   ```
2. Start the PostgreSQL container:
   ```bash
   ./start-db.sh
   ```
   *Note: This script uses Podman to run a PostgreSQL 17 instance.*

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   go mod download
   ```
3. Run the server:
   ```bash
   go run cmd/server/main.go
   ```
   *The backend will be available at `http://localhost:8082`.*

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
   *The frontend will be available at `http://localhost:8080`.*

## Folder Description

- **`frontend/`**: Vue.js 3 application using Vuetify 3, Vite, and Vitest.
  - `src/components/`: Reusable UI components.
  - `src/pages/`: Main view components for routing.
  - `src/services/`: API client and communication logic.
  - `mockdata/`: Mock server and JSON data for local development.
- **`backend/`**: Go REST API using the Gin framework and GORM.
  - `cmd/server/`: Entry point for the Go application.
  - `internal/api/`: API handlers and routing logic.
  - `internal/models/`: Database schema definitions.
  - `internal/storage/`: Database interaction and repository patterns.
  - `db/`: Database initialization scripts and data storage.
- **`specs/`**: Detailed documentation, design plans, and task lists for project features.
- **`.github/workflows/`**: CI/CD pipelines for automated testing and building.
- **`.gemini/`**: Configuration and instructions for AI-assisted development.
