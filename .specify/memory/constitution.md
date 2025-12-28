<!--
SYNC IMPACT REPORT
==================
Version Change: 1.3.0 → 1.4.0
Updated: 2025-12-28
Rationale: Added Backend Architecture section documenting domain-oriented (vertical slice) structure

Modified Principles: None

Added Sections:
  - IX. Backend Architecture - Defined mandatory domain-oriented folder structure

Removed Sections: N/A

Templates Status:
  ✅ plan-template.md - Reviewed, compatible
  ✅ spec-template.md - Reviewed, compatible
  ✅ tasks-template.md - Reviewed, compatible
  ⚠ Command files - No updates needed

Follow-up TODOs: None
-->

# Finance App Constitution

## Core Principles

### I. Simplicity First

The application maintains a focused scope on personal financial planning, tracking fixed costs, forecasting finances, and managing wealth accumulation. Every feature must serve the core mission of helping users understand and plan their finances.

**Rationale**: As a personal finance tool, complexity is the enemy of usability. Users need clear insights, not feature bloat.

### II. User Experience Excellence (NON-NEGOTIABLE)

Good UX is a fundamental requirement, not an afterthought. The application must be intuitive, responsive, and provide immediate feedback to user actions. Financial data must be presented clearly with visual aids (charts, tables) that enhance understanding.

**Requirements**:
- Frontend validation provides immediate, helpful feedback before submission
- Forms guide users with clear labels, placeholders, and inline validation
- Error messages are user-friendly and actionable
- Loading states and transitions are smooth and informative
- Responsive design works across devices (desktop, tablet, mobile)
- Visual feedback for all user interactions

**Rationale**: Users entrust this application with their financial planning. A confusing or frustrating experience undermines that trust and reduces adoption.

### III. Full-Stack Separation

The application maintains a clear separation between backend (Go) and frontend (Vue.js) with a well-defined REST API contract. Backend logic handles data persistence and business rules; frontend handles user experience and presentation.

**Validation Strategy**:
- **Frontend validation**: Serves UX - provides immediate feedback, prevents bad submissions, guides user input
- **Backend validation**: Serves data integrity - enforces business rules, prevents corruption, ensures security

Both layers validate, but for different reasons. Frontend validation is never trusted by backend.

**Rationale**: This enables independent development, testing, and deployment of each layer while maintaining system integrity through API contracts.

### IV. Test Coverage Mandate (NON-NEGOTIABLE)

All new features and refactored code MUST achieve and maintain minimum 60% test coverage. Tests must be written before implementation (TDD approach) and must pass before code review.

**Requirements**:
- Unit tests for business logic (backend services, utility functions)
- Integration tests for API endpoints
- Component tests for Vue.js components
- Coverage reports generated on every build
- Pull requests blocked if coverage drops below 60%

**Rationale**: The vue-frontend branch represents a major refactoring that will replace the main branch. Quality assurance through testing is critical to ensure the refactored application is reliable and maintainable.

### V. API-First Design

All data interactions flow through well-defined REST API endpoints. API contracts are documented and versioned. Breaking changes to APIs require explicit versioning and migration support.

**Current API Patterns**:
- RESTful endpoints (`GET /api/costs`, `POST /api/costs/monthly`)
- JSON request/response format
- Standard HTTP status codes
- Separation by resource (costs, specialcosts, overview, wealth)

**Rationale**: Clear API contracts enable frontend/backend teams to work independently and ensure system reliability.

### VI. Data Integrity

Backend validation and database constraints ensure data integrity. All financial data must be validated at the backend layer with business rule enforcement. Database transactions must be atomic. Data loss is unacceptable - all destructive operations require confirmation.

**Requirements**:
- Backend validation enforces all business rules
- Database constraints enforced via GORM migrations
- Error handling with meaningful messages for both users and logs
- Audit logging for financial operations
- Atomic transactions for multi-step operations

**Rationale**: Financial applications require the highest standards of data accuracy and integrity. Users must trust the system with their financial planning.

### VII. Visual Design Language

The application follows a **Fintech Dark Mode** aesthetic designed for modern, engaging financial dashboards.

**Theme & Color Palette**:
- Deep dark background (`#121212`) with high-contrast elements
- Surface/cards in elevated gray (`#1E1E1E`) for depth separation
- **Mint Green** accent for positive financial trends
- **Soft Red/Coral** alert color for negative trends or warnings

**Visual Principles**:
- Aggressive rounded corners (`rounded-xl`) for friendly, modern feel
- High elevation shadows on main cards for visual hierarchy
- Bold, large typography for key financial numbers (`text-h4`, `font-weight-bold`)
- Muted, smaller text for labels (`text-overline`, `grey--text`)

**Layout Architecture**:
- **Navigation Toggle**: Floating button with glassmorphism effect (semi-transparent + blur)
  - Positioned bottom-left on desktop, top-left on mobile
  - Overlays content without displacing it
- **Navigation Drawer**:
  - Mobile: Slide-in overlay that covers content
  - Desktop: Persistent side panel that pushes/resizes main content
- **Hero Section**: Large forecast chart as the visual anchor (top of main content)
- **KPI Cards**: Three highlight cards in a row beneath the chart
  - Current Balance (editable via click-to-edit modal)
  - Real Monthly Surplus with sparkline trend
  - Lowest Projected Point (risk indicator)

**Interaction Patterns**:
- Click-to-edit pattern for key inputs (modal dialogs)
- Immediate visual feedback on all interactions
- Charts use gradient fills to anchor data visually

**Rationale**: Financial apps require trust and clarity. The dark mode reduces eye strain, while the visual hierarchy guides users from forecast overview (chart) to actionable metrics (cards), answering key questions: "Will I stay solvent?" and "How much can I spend?"

### VIII. Frontend Architecture

The frontend follows a **Page-Centric Component Structure**.

**Organization Rules**:
- **Page Directories**: Every page/view has a dedicated folder (e.g., `src/components/wealth/`) containing the main page component and its specific sub-components.
- **Common Components**: Strictly reusable, generic UI elements reside in the `src/components/commons/` folder.
- **Colocation**: Logic and styles specific to a page should be colocated within that page's directory.

**Rationale**: This structure scales better than grouping by type (e.g., all buttons together). It ensures that deleting a feature (page) allows for safe deletion of its dependencies without checking the entire codebase.

### IX. Backend Architecture

The backend follows a **Domain-Oriented (Vertical Slice) Architecture**.

**Directory Structure**:
```
backend/internal/
├── api/                    # Server wiring (central orchestrator)
│   └── server.go           # Dependency injection and handler registration
├── auth/                   # Authentication domain
│   ├── api/                # HTTP handlers
│   ├── middleware/         # Auth middleware
│   └── jwt.go              # JWT logic
├── user/                   # User domain
│   ├── api/                # HTTP handlers
│   ├── service/            # Business logic
│   └── model.go            # User entity
├── wealth/                 # Wealth management domain
│   ├── api/                # HTTP handlers (profile, forecast)
│   ├── service/            # Business logic
│   ├── profile.go          # WealthProfile entity
│   └── forecast.go         # Forecast entities
├── workspace/              # Workspace/collaboration domain
│   ├── api/                # HTTP handlers
│   ├── service/            # Business logic (workspace, invite, email)
│   ├── workspace.go        # Workspace entity
│   └── invite.go           # Invite entity
├── cost/                   # Cost management domain
│   ├── api/                # HTTP handlers (fixed, special)
│   ├── repository/         # Data access
│   ├── fixed_cost_model.go
│   └── special_cost_model.go
├── overview/               # Dashboard/overview domain
│   ├── api/                # HTTP handlers
│   └── model/              # Statistics entities
├── platform/               # Shared infrastructure
│   ├── types/              # Shared value objects (YearMonth)
│   └── db/                 # Database configuration
└── storage/                # Repository implementations (GORM)
```

**Organization Rules**:
- **Domain Packages**: Each domain contains its own handlers, services, and models
- **Handler Pattern**: All HTTP handlers are standalone structs with injected dependencies (not methods on a central Server)
- **Service Layer**: Business logic resides in `service/` subdirectories
- **Repository Pattern**: Data access through repository interfaces; implementations in `storage/` or domain `repository/`
- **Colocation**: Domain-specific code lives within its domain package

**Naming Conventions**:
- Handlers: `Handler` struct with methods like `GetX`, `CreateX`, `DeleteX`
- Services: `XService` struct with `NewXService` constructor
- Models: Singular entity names (e.g., `User`, `Workspace`, `FixedCost`)

**Rationale**: Vertical slice architecture groups code by feature/domain rather than by technical layer. This makes it easier to understand, modify, and delete features without affecting unrelated code. Each domain is a self-contained unit with clear boundaries.

## Technology Standards

### Backend Stack

- **Language**: Go 1.17+
- **Framework**: Gin (HTTP router)
- **ORM**: GORM v1.21+
- **Database**: PostgreSQL 15+
- **Configuration**: Environment variables via godotenv
- **Testing**: Go standard testing package + testify (when coverage requirement added)

### Frontend Stack

- **Framework**: Vue.js 3.3+
- **UI Library**: Vuetify 3.3+
- **Routing**: Vue Router 4.2+
- **Build Tool**: Vite 4.4+
- **Charts**: Chart.js 4.4+ via vue-chartjs
- **Testing**: Vitest + Vue Test Utils

### Infrastructure

- **Database**: PostgreSQL 15 via Docker Compose
- **Container Orchestration**: Docker Compose
- **Backend Port**: 8082
- **Frontend Dev Port**: 8080
- **Database Port**: 5432

### Coding Standards

- **Go**: Follow standard Go conventions, use gofmt
- **JavaScript**: ESLint with Vue plugin
- **Console Logging**: Allowed (no-console rule disabled in frontend)
- **Documentation**: Code comments for complex business logic

## Quality Assurance

### Testing Strategy

1. **Unit Tests** (Target: 70% coverage)
   - Backend: Test business logic, validation rules, data transformations
   - Frontend: Test utility functions, services, and form validation logic

2. **Integration Tests** (Target: 50% coverage)
   - Backend: Test API endpoints with test database
   - Frontend: Test component integration with mocked APIs

3. **Contract Tests** (Required for API changes)
   - Validate API request/response schemas
   - Ensure backward compatibility

4. **Overall Target**: Minimum 60% combined test coverage

### Development Workflow

1. Feature specification via `/speckit.specify`
2. Implementation planning via `/speckit.plan`
3. Task breakdown via `/speckit.tasks`
4. TDD: Write failing tests first
5. Implement feature to pass tests
6. Code review with coverage check
7. Merge only if coverage ≥ 60%

### Quality Gates

- All tests must pass
- Code coverage ≥ 60%
- No critical linting errors
- API contracts documented
- Database migrations tested
- UX reviewed for clarity and responsiveness

## Governance

### Amendment Process

1. Propose constitutional changes via pull request
2. Document rationale and impact on existing code
3. Update affected templates (plan, spec, tasks)
4. Require approval from project maintainer
5. Version bump according to semantic versioning

### Versioning Policy

Constitution follows semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes to core principles
- **MINOR**: New principles or sections added
- **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance Review

- All pull requests must reference this constitution
- Architecture decisions must align with Core Principles I-IX
- Complexity must be justified (favor simplicity)
- Test coverage verified on every build
- UX changes reviewed for user-friendliness

### Branch Strategy

- **master**: Stable production branch (current Java application)
- **vue-frontend**: Major refactoring branch (this constitution applies here)
- Constitution applies ONLY to vue-frontend branch and future branches derived from it
- Upon merge to master, this constitution supersedes all prior practices

**Version**: 1.4.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-28