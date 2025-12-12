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

