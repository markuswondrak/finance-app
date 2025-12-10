# finance-app

A simple financial planning application. Manage your fixed costs and see a forecast of you finances in a nice overview.

## Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Go 1.21+](https://golang.org/dl/) (for backend development)
- [Node.js 18+](https://nodejs.org/) and npm/pnpm (for frontend development)

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd finance-app
```

### 2. Start the PostgreSQL database

```bash
docker-compose up -d
```

This starts a PostgreSQL container in the background. The database will be available at `localhost:5432`.

### 3. Start the Backend (Go)

```bash
cd backend/src
go run main.go
```

The backend API will be available at `http://localhost:8082`

### 4. Start the Frontend (Vue.js)

```bash
cd frontend
npm install  # or: pnpm install
npm run dev  # or: pnpm dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in the terminal).

## Development Workflow

### Daily Development

```bash
# Make sure the database is running (only needed once)
docker-compose up -d

# Start backend
cd backend/src && go run main.go

# In another terminal: Start frontend
cd frontend && npm run dev
```

### Stop the database

```bash
docker-compose down
```

To also remove the database volume (deletes all data):

```bash
docker-compose down -v
```

## Configuration

### Environment Variables

The application uses environment variables for configuration. A `.env.example` file is provided as a template.

**Backend configuration:**
- Copy `.env.example` to `backend/.env` (already done for you)
- Modify values as needed for your local setup

Default values:
- Database: `localhost:5432`
- Database name: `financeapp`
- Database user: `postgres`
- Database password: `admin`
- Backend port: `8082`

### Database Initialization

SQL initialization scripts can be placed in `backend/db/init/`. These scripts run automatically when the PostgreSQL container is created for the first time.

## Project Structure

```
finance-app/
├── docker-compose.yml          # PostgreSQL container configuration
├── .env.example                # Environment variables template
├── backend/
│   ├── .env                    # Local environment variables (not in git)
│   ├── db/
│   │   └── init/              # SQL initialization scripts
│   │       └── 01_init.sql
│   ├── src/
│   │   └── main.go            # Backend entry point
│   └── go.mod
└── frontend/
    ├── src/                    # Vue.js source files
    └── package.json
```

## Troubleshooting

### Database connection fails

Check if PostgreSQL is running:

```bash
docker-compose ps
```

Check database logs:

```bash
docker-compose logs postgres
```

### Port already in use

If port 5432 is already in use, modify the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Use 5433 on host instead
```

Then update `DB_PORT` in `backend/.env` to `5433`.

## Production Deployment

Production Link: https://finance.wondee.info
Demo Credentials: Demo/Demo; Alternative: Demo2/Demo

