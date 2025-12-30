<!--
SYNC IMPACT REPORT
==================
Version Change: 1.4.0 → 1.5.0
Updated: 2025-12-30
Rationale: Major refactor to align with codebase reality. Added Business Case, Core Entities, Best Practices, and General Precautions sections based on actual code analysis.

Modified Sections:
  - Technology Standards - Updated version numbers to match actual dependencies
  - Backend Architecture - Updated to include spend domain
  - Infrastructure - Updated to reflect GCP Cloud Run deployment

Added Sections:
  - Business Case - Inferred from README and feature code
  - Core Entities - Documented actual data models with fields and relationships
  - Best Practices - Documented coding patterns and conventions found in codebase
  - General Precautions - Documented implicit rules discovered in code

Removed Sections: N/A

Templates Status:
  ✅ plan-template.md - Reviewed, compatible
  ✅ spec-template.md - Reviewed, compatible
  ✅ tasks-template.md - Reviewed, compatible

Follow-up TODOs: None
-->

# Finance App Constitution

## Business Case

### Vision

A modern personal finance tracking application that helps users manage fixed costs, track special expenses, manage wealth accumulation, and visualize financial forecasts. The application answers two key questions: "Will I stay solvent?" and "How much can I spend?"

### Key Features

1. **Fintech Dashboard**: High-level overview with current balance, monthly surplus, and risk indicators
2. **Fixed Costs Management**: Track recurring expenses (monthly, quarterly, half-yearly, yearly)
3. **Special Costs Tracking**: Manage one-time or irregular expenses
4. **Wealth Management**: Track assets, configure wealth profiles, and forecast long-term accumulation
5. **Save-to-Spend**: Monthly budgeting feature that tracks pending costs against available balance
6. **Financial Forecasting**: Visual sparklines and charts for surplus trends and balance projections
7. **Workspace Collaboration**: Multi-user workspaces with invite system for shared financial planning
8. **Google Authentication**: Secure login using Google OAuth2
9. **User Onboarding**: Guided setup wizard for new users

### Target Users

Personal finance enthusiasts who want clear visibility into their recurring costs, future projections, and wealth accumulation trajectory.

---

## Core Entities

### User
| Field | Type | Description |
|-------|------|-------------|
| ID | uint | Primary key |
| GoogleID | string | Google OAuth identifier (unique) |
| Email | string | User email (unique) |
| Name | string | Display name |
| AvatarURL | string | Profile picture URL |
| CurrentAmount | int | Legacy field (cents) |
| WorkspaceID | uint | Foreign key to Workspace |
| OnboardingCompleted | bool | Whether user completed onboarding |
| CreatedAt | time.Time | Record creation timestamp |
| UpdatedAt | time.Time | Last update timestamp |

### Workspace
| Field | Type | Description |
|-------|------|-------------|
| ID | uint | Primary key |
| Name | string | Workspace name |
| CurrentAmount | int | Current balance (cents) |
| SaveToSpendBalance | int | Checking account balance (cents) |
| CreatedAt | time.Time | Record creation timestamp |
| UpdatedAt | time.Time | Last update timestamp |

**Relationships**: Has many Users, FixedCosts, Invites

### FixedCost
| Field | Type | Description |
|-------|------|-------------|
| ID | int | Primary key |
| UserID | uint | Creator user ID |
| WorkspaceID | uint | Foreign key to Workspace |
| Name | string | Cost description |
| Amount | int | Amount in cents |
| From | *YearMonth | Start date (nullable) |
| To | *YearMonth | End date (nullable) |
| DueMonth | Months | Array of months when cost is due |
| IsSaving | bool | Whether this is a savings contribution |

### SpecialCost
| Field | Type | Description |
|-------|------|-------------|
| ID | int | Primary key |
| UserID | uint | Creator user ID |
| WorkspaceID | uint | Foreign key to Workspace |
| Name | string | Cost description |
| Amount | int | Amount in cents |
| DueDate | *YearMonth | When the cost is due |
| IsSaving | bool | Whether this is a savings contribution |

### WealthProfile
| Field | Type | Description |
|-------|------|-------------|
| ID | uint | Primary key |
| UserID | uint | Creator user ID |
| WorkspaceID | uint | Foreign key to Workspace |
| CurrentWealth | float64 | Current wealth amount |
| ForecastDurationYears | int | Forecast horizon |
| RateWorstCase | float64 | Pessimistic growth rate |
| RateAverageCase | float64 | Expected growth rate |
| RateBestCase | float64 | Optimistic growth rate |
| CreatedAt | time.Time | Record creation timestamp |
| UpdatedAt | time.Time | Last update timestamp |

### Invite
| Field | Type | Description |
|-------|------|-------------|
| ID | uint | Primary key |
| Token | string | Unique invite token |
| WorkspaceID | uint | Foreign key to Workspace |
| InvitedBy | uint | User ID of inviter |
| Email | string | Invitee email |
| ExpiresAt | time.Time | Token expiration |
| IsUsed | bool | Whether invite was consumed |
| CreatedAt | time.Time | Record creation timestamp |

### MonthlyPaymentStatus
| Field | Type | Description |
|-------|------|-------------|
| ID | uint | Primary key |
| WorkspaceID | uint | Foreign key to Workspace |
| FixedCostID | int | Foreign key to FixedCost |
| Month | YearMonth | The month this status applies to |
| IsPaid | bool | Whether the cost has been paid |
| PaidAt | *time.Time | Payment timestamp (nullable) |

### OneTimePendingCost
| Field | Type | Description |
|-------|------|-------------|
| ID | uint | Primary key |
| WorkspaceID | uint | Foreign key to Workspace |
| Name | string | Cost description |
| Amount | int | Amount in cents |
| Month | YearMonth | Month this cost applies to |
| IsPaid | bool | Whether the cost has been paid |
| CreatedAt | time.Time | Record creation timestamp |

### Value Objects

**YearMonth**: Custom type stored as string format `"YEAR MONTH"` (e.g., `"2025 12"`). Provides date range operations without day precision.

**Months**: Array of integers (1-12) stored as space-separated string. Used for recurring cost schedules.

---

## Architecture

### Tech Stack

#### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Go | 1.24+ | Primary language |
| Gin | 1.11+ | HTTP router |
| GORM | 1.21+ | ORM |
| PostgreSQL | 17 | Database |
| golang-jwt/jwt | v5.3+ | JWT authentication |
| godotenv | 1.5+ | Environment configuration |
| testify | 1.11+ | Testing assertions |
| Mailjet | v3 | Email service (invites) |

#### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Vue.js | 3.3+ | UI framework |
| Vuetify | 3.3+ | Component library |
| Vite | 7.2+ | Build tool |
| Vue Router | 4.2+ | Routing |
| Chart.js | 4.4+ | Charts via vue-chartjs |
| Axios | 1.13+ | HTTP client |
| vue3-google-login | 2.0+ | Google OAuth |
| Vitest | 4.0+ | Testing |
| @vue/test-utils | 2.4+ | Component testing |
| Font Awesome | 7.1+ | Icons |
| MDI Font | 7.2+ | Material icons |
| Sass | 1.66+ | Styling |
| vite-ssg | 28.2+ | Static site generation |

#### Infrastructure (Production)
| Component | Technology | Details |
|-----------|------------|---------|
| Cloud Provider | Google Cloud Platform | |
| Backend Hosting | Cloud Run | Container-based |
| Frontend Hosting | Cloud Run | Nginx container |
| Database | Compute Engine VM | PostgreSQL 17 |
| Secrets | Secret Manager | DB password, JWT, OAuth, Mailjet |
| Container Registry | Artifact Registry | `finanz-repo` |
| Networking | VPC Connector | Private backend-DB communication |
| IaC | Terraform | Infrastructure as code |
| CI/CD | GitHub Actions | Automated testing and deployment |

#### Infrastructure (Development)
| Component | Details |
|-----------|---------|
| Database | PostgreSQL 17 via Podman/Docker |
| Backend Port | 8082 |
| Frontend Dev Port | 8080 |
| Database Port | 5432 |

### Design Patterns

#### Backend: Domain-Oriented (Vertical Slice) Architecture

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
├── spend/                  # Save-to-Spend domain
│   ├── api/                # HTTP handlers
│   ├── service/            # Business logic
│   ├── repository/         # Data access
│   ├── monthly_payment_status.go
│   └── one_time_cost.go
├── overview/               # Dashboard/overview domain
│   ├── api/                # HTTP handlers
│   └── model/              # Statistics entities
├── platform/               # Shared infrastructure
│   ├── types/              # Shared value objects (YearMonth)
│   └── db/                 # Database configuration
└── storage/                # Repository implementations (GORM)
```

#### Frontend: Page-Centric Component Structure

```
frontend/src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── BaseChart.vue
│   │   ├── BaseHighlightCard.vue
│   │   ├── BaseTable.vue
│   │   ├── BaseTextField.vue
│   │   ├── DeleteButton.vue
│   │   ├── MonthYearDatepicker.vue
│   │   ├── TableActionBar.vue
│   │   └── Utils.js
│   ├── overview/         # Dashboard page + subcomponents
│   ├── fixedcosts/       # Fixed costs page + subcomponents
│   ├── wealth/           # Wealth page + subcomponents
│   ├── spend/            # Save-to-Spend page + subcomponents
│   ├── settings/         # Settings page + subcomponents
│   ├── navigation/       # Navigation components
│   ├── landing/          # Landing page + subcomponents
│   ├── help/             # Help/onboarding components
│   └── editform/         # Shared form components
├── services/             # API clients
│   ├── auth.js
│   ├── user.js
│   ├── specialcosts.js
│   ├── spend.js
│   ├── statistics.js
│   ├── wealthService.js
│   ├── workspaceService.js
│   └── dateAdapter.js
├── composables/          # Vue composables
├── plugins/              # Vue plugins (Vuetify)
├── router/               # Vue Router configuration
├── assets/               # Static assets
└── tests/                # Test files
```

---

## Best Practices

### Backend Conventions

1. **Handler Pattern**: All HTTP handlers are standalone structs with injected dependencies
   ```go
   type Handler struct {
       Service *SomeService
   }
   func (h *Handler) GetX(c *gin.Context) { ... }
   ```

2. **Service Pattern**: Business logic in `XService` structs with `NewXService` constructors
   ```go
   type ProfileService struct { repo Repository }
   func NewProfileService(repo Repository) *ProfileService { ... }
   ```

3. **Repository Pattern**: Data access through interfaces; implementations in `storage/` or domain `repository/`

4. **Model Naming**: Singular entity names (e.g., `User`, `Workspace`, `FixedCost`)

5. **Testing**: Use testify for assertions, mock repositories for unit tests

### Frontend Conventions

1. **Component Files**: Single-file components (`.vue`) with `<script>`, `<template>`, `<style>`

2. **Service Layer**: API calls abstracted in `/services/*.js` files using Axios

3. **Test Files**: Colocated with components as `ComponentName.spec.js`

4. **Run Tests**: `pnpm test` for watch mode, `pnpm test:coverage` for coverage report with `--run` flag

5. **Build**: `pnpm build` for SSG, `pnpm build:spa` for SPA mode

### API Conventions

1. **RESTful Endpoints**: Resource-based URLs
   - `GET /api/costs` - List fixed costs
   - `POST /api/costs/monthly` - Create fixed cost
   - `GET /api/specialcosts` - List special costs
   - `GET /api/wealth/profile` - Get wealth profile
   - `GET /api/spend/status` - Get save-to-spend status

2. **Authentication**: JWT tokens in Authorization header, workspace_id in token claims

3. **JSON Format**: All requests/responses use JSON

4. **Error Responses**: Standard HTTP status codes with JSON error body

### Visual Design Conventions

1. **Color Palette**:
   - Background: `#121212`
   - Surface/Cards: `#1E1E1E`
   - Success/Positive: Mint Green
   - Error/Negative: Soft Red/Coral

2. **Typography**:
   - Key numbers: `text-h4`, `font-weight-bold`
   - Labels: `text-overline`, `grey--text`

3. **Components**:
   - Cards: `rounded-xl` with elevation shadows
   - Navigation: Glassmorphism effect (semi-transparent + blur)

---

## General Precautions

### Data Storage Rules

1. **Money is stored as integers (cents)**: All `Amount` fields are `int` representing cents, not floats
   ```go
   Amount int  // 1000 = $10.00
   ```

2. **YearMonth stored as string**: Custom value object serialized as `"YEAR MONTH"`
   ```go
   // "2025 12" in database
   ```

3. **No soft-deletes**: Entities are hard-deleted; no `DeletedAt` field exists

4. **Workspace isolation**: All user data is scoped to WorkspaceID for multi-tenant isolation

### Security Considerations

1. **JWT tokens** contain user_id and workspace_id claims

2. **Google OAuth** is the only authentication method

3. **Secrets in production** are managed via GCP Secret Manager (DB password, JWT secret, OAuth credentials, Mailjet keys)

4. **Backend never trusts frontend validation**: All business rules re-validated server-side

### Development Precautions

1. **Run `go mod download`** before backend development

2. **Use Podman/Docker** for local PostgreSQL: `cd backend/db && ./start-db.sh`

3. **Vite proxy** routes `/api/*` and `/auth/*` to backend in dev mode

4. **Test isolation**: Mock repositories for unit tests, test databases for integration tests

5. **Coverage requirement**: Minimum 60% test coverage for PRs

---

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

**Rationale**: Quality assurance through testing is critical to ensure the application is reliable and maintainable.

### V. API-First Design

All data interactions flow through well-defined REST API endpoints. API contracts are documented and versioned. Breaking changes to APIs require explicit versioning and migration support.

**Rationale**: Clear API contracts enable frontend/backend teams to work independently and ensure system reliability.

### VI. Data Integrity

Backend validation and database constraints ensure data integrity. All financial data must be validated at the backend layer with business rule enforcement. Database transactions must be atomic. Data loss is unacceptable - all destructive operations require confirmation.

**Requirements**:
- Backend validation enforces all business rules
- Database constraints enforced via GORM migrations
- Error handling with meaningful messages for both users and logs
- Atomic transactions for multi-step operations

**Rationale**: Financial applications require the highest standards of data accuracy and integrity. Users must trust the system with their financial planning.

---

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
- Architecture decisions must align with Core Principles
- Complexity must be justified (favor simplicity)
- Test coverage verified on every build
- UX changes reviewed for user-friendliness

**Version**: 1.5.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-30
