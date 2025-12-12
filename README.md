# finance-app

A simple financial planning application. Manage your fixed costs and see a forecast of you finances in a nice overview.

## Prerequisites

- **Container Runtime**: [Podman](https://podman.io/) (Recommended) or [Docker](https://www.docker.com/get-started)
  - **Installation (Linux)**: `sudo apt install podman` or `sudo dnf install podman`
  - **Installation (macOS)**: `brew install podman`
- [Go 1.21+](https://golang.org/dl/) (for backend development)
- [Node.js 18+](https://nodejs.org/) and npm/pnpm (for frontend development)

> **Note**: The development script `dev.sh` is the recommended way to run the project. It automatically manages the PostgreSQL container using Podman (default) or Docker.

## Quick Start

### Option 1: Automated Setup (Recommended)

Use the development script for one-command startup:

```bash
# Make the script executable (first time only)
chmod +x dev.sh

# Start all services (database, backend, frontend)
./dev.sh start
```

The script will:
- Start PostgreSQL in a container (Podman/Docker)
- Start the Go backend server (port 8082)
- Start the Vue.js frontend (port 8081)

**Access the application:**
- Frontend: `http://localhost:8081`
- Backend API: `http://localhost:8082`
- Database: `localhost:5432`

**Other commands:**
```bash
./dev.sh stop       # Stop all services
./dev.sh restart    # Restart all services
./dev.sh status     # Check service status
./dev.sh logs       # View all logs
./dev.sh logs backend   # View backend logs only
./dev.sh logs frontend  # View frontend logs only
./dev.sh help       # Show all available commands
```

### Option 2: Manual Setup

If you prefer to run services manually:

#### 1. Clone the repository

```bash
git clone <repository-url>
cd finance-app
```

#### 2. Start the PostgreSQL database

```bash
```bash
# Using Podman (recommended)
podman run -d \
  --name finance-app-db \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=financeapp \
  -v postgres_data:/var/lib/postgresql/data \
  docker.io/library/postgres:15-alpine

# Or using Docker
docker run -d --name finance-app-db ... # (same arguments as above)
```

This starts a PostgreSQL container in the background. The database will be available at `localhost:5432`.

#### 3. Start the Backend (Go)

```bash
cd backend/cmd/server
go run main.go
```

The backend API will be available at `http://localhost:8082`

#### 4. Start the Frontend (Vue.js)

```bash
cd frontend
npm install  # or: pnpm install
npm run serve
```

The frontend will be available at `http://localhost:8081`.

## Development Workflow

### Using the Development Script (Recommended)

```bash
# Start everything
./dev.sh start

# View logs in real-time
./dev.sh logs

# Stop everything when done
./dev.sh stop
```

**Logs and PIDs:**
- Logs are stored in `.dev-logs/`
- Process IDs are stored in `.dev-pids/`
- Both directories are automatically created and managed

### Manual Development

```bash
# Make sure the database is running (only needed once)
```bash
./dev.sh reset  # Stops services and removes database volume
```

Or manually:

```bash
podman stop finance-app-db
podman rm finance-app-db
podman volume rm postgres_data
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

## Speckit Workflow Documentation

This project uses a modular **Speckit** workflow system for feature specification and development. The workflows are organized with a clear separation between execution logic and supporting documentation.

### Workflow Structure

```
.agent/workflows/              # Main workflow definitions (compact, execution-focused)
├── speckit.specify.md        # Create feature specifications (3.7 KB)
├── speckit.checklist.md      # Generate quality checklists (4.5 KB)
├── speckit.clarify.md        # Clarify requirements
├── speckit.plan.md           # Create implementation plans
├── speckit.tasks.md          # Generate task breakdowns
└── speckit.implement.md      # Execute implementation

.specify/docs/                # Supporting documentation (detailed, reusable)
├── specify/
│   ├── specification-guidelines.md
│   ├── success-criteria-guidelines.md
│   └── validation-process.md
└── checklist/
    ├── core-concept.md
    ├── quality-dimensions.md
    ├── domain-examples.md
    └── clarification-algorithm.md
```

### Key Benefits

**Modular Design**:
- **Compact workflows**: 70-75% smaller, fit better in AI context windows
- **Reusable documentation**: Guidelines can be referenced by multiple workflows
- **Easy maintenance**: Update examples without touching workflow logic
- **Clear separation**: Execution steps vs detailed guidance

**Workflow Files** (`.agent/workflows/`):
- Contain execution orchestration and steps
- Reference detailed documentation when needed
- Focus on "what to do" and "when to do it"

**Documentation Files** (`.specify/docs/`):
- Contain detailed guidelines, examples, and patterns
- Provide comprehensive reference material
- Explain "how to do it" and "why"

### Available Workflows

| Workflow | Purpose | Size |
|----------|---------|------|
| `/speckit.specify` | Create feature specifications from natural language | 3.7 KB |
| `/speckit.checklist` | Generate requirements quality checklists | 4.5 KB |
| `/speckit.clarify` | Ask clarifying questions to refine specs | 11.5 KB |
| `/speckit.plan` | Create technical implementation plans | 3.3 KB |
| `/speckit.tasks` | Generate dependency-ordered task breakdowns | 6.5 KB |
| `/speckit.implement` | Execute implementation plan | 7.6 KB |

### Documentation Organization

**Specification Documentation** (`.specify/docs/specify/`):
- `specification-guidelines.md` - Core principles for writing specs
- `success-criteria-guidelines.md` - How to write measurable success criteria
- `validation-process.md` - Quality validation procedures

**Checklist Documentation** (`.specify/docs/checklist/`):
- `core-concept.md` - "Unit Tests for English" philosophy
- `quality-dimensions.md` - How to write checklist items
- `domain-examples.md` - Real-world examples (UX, API, Security)
- `clarification-algorithm.md` - Question generation logic

### Usage Example

When using `/speckit.specify`, the workflow:
1. Reads the compact main workflow for execution steps
2. References `specification-guidelines.md` for writing principles
3. References `success-criteria-guidelines.md` for examples
4. References `validation-process.md` for quality checks

This modular approach keeps workflows focused and documentation comprehensive.

## Troubleshooting

### Database connection fails

### Database connection fails

Check if PostgreSQL is running:

```bash
# Via script
./dev.sh status

# Or manually
podman ps
```

Check database logs:

```bash
# Via script
./dev.sh logs db

# Or manually
podman logs finance-app-db
```

### Port already in use

If port 5432 is already in use, you need to update the port in your configuration.

1. Edit `dev.sh` and change `DB_PORT`:
   ```bash
   DB_PORT=5433
   ```
2. Update `backend/.env` to match:
   ```env
   DB_PORT=5433
   ```

## Production Deployment

Production Link: https://finance.wondee.info
Demo Credentials: Demo/Demo; Alternative: Demo2/Demo

