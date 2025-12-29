# Refactoring Plan: Domain-Oriented (Vertical Slice) Architecture

This plan outlines the steps to refactor the `backend` codebase from a layered structure to a domain-oriented structure, following "Vertical Slice" principles while preserving Git history.

## Target Structure Overview
- `cmd/server/main.go`: Entry point (Unchanged).
- `internal/<domain>/`: Grouped logic by feature (model, service, api, repository).
- `internal/platform/`: Shared technical code (database, shared types, http server).

## Proposed File Mapping

| Domain | Current Path | New Path | Description |
| :--- | :--- | :--- | :--- |
| **Entry Point** | `backend/cmd/server/main.go` | `backend/cmd/server/main.go` | Main application entry point (Unchanged) |
| **Auth** | `backend/internal/api/auth/handlers.go` | `backend/internal/auth/api/handlers.go` | Auth HTTP Handlers |
| | `backend/internal/api/auth/handlers_test.go` | `backend/internal/auth/api/handlers_test.go` | |
| | `backend/internal/api/auth/jwt.go` | `backend/internal/auth/jwt.go` | JWT Logic |
| | `backend/internal/api/auth/jwt_test.go` | `backend/internal/auth/jwt_test.go` | |
| **User** | `backend/internal/models/user.go` | `backend/internal/user/model.go` | User Entity |
| | `backend/internal/services/user_service.go` | `backend/internal/user/service/service.go` | User Business Logic |
| | `backend/internal/storage/userRepo.go` | `backend/internal/user/repository/user_repository.go` | User Repository Impl |
| | `backend/internal/api/user.go` | `backend/internal/user/api/handler.go` | User HTTP Handler |
| | `backend/internal/api/user_test.go` | `backend/internal/user/api/handler_test.go` | |
| **Wealth** | `backend/internal/models/wealth_profile.go` | `backend/internal/wealth/profile.go` | Wealth Profile Entity |
| | `backend/internal/models/forecast.go` | `backend/internal/wealth/forecast.go` | Forecast Entity |
| | `backend/internal/services/wealth_profile_service.go` | `backend/internal/wealth/service/profile_service.go` | |
| | `backend/internal/services/wealth_profile_service_test.go` | `backend/internal/wealth/service/profile_service_test.go` | |
| | `backend/internal/services/wealth_forecast_service.go` | `backend/internal/wealth/service/forecast_service.go` | |
| | `backend/internal/services/wealth_forecast_service_test.go` | `backend/internal/wealth/service/forecast_service_test.go` | |
| | `backend/internal/services/wealth_forecast_extraction_test.go` | `backend/internal/wealth/service/forecast_extraction_test.go` | |
| | `backend/internal/storage/wealth_profile_repo.go` | `backend/internal/wealth/repository/wealth_profile_repository.go` | Wealth Repository Impl |
| | `backend/internal/api/wealth_profile_handler.go` | `backend/internal/wealth/api/profile_handler.go` | |
| | `backend/internal/api/wealth_forecast_handler.go` | `backend/internal/wealth/api/forecast_handler.go` | |
| **Workspace** | `backend/internal/models/workspace.go` | `backend/internal/workspace/workspace.go` | Workspace Entity |
| | `backend/internal/models/invite.go` | `backend/internal/workspace/invite.go` | Invite Entity |
| | `backend/internal/services/workspace_service.go` | `backend/internal/workspace/service/workspace_service.go` | |
| | `backend/internal/services/invite_service.go` | `backend/internal/workspace/service/invite_service.go` | |
| | `backend/internal/storage/workspace_repository.go` | `backend/internal/workspace/repository/workspace_repository.go` | Workspace Repository Impl |
| | `backend/internal/storage/invite_repository.go` | `backend/internal/workspace/repository/invite_repository.go` | Invite Repository Impl |
| | `backend/internal/api/workspace_handler.go` | `backend/internal/workspace/api/handler.go` | |
| **Cost** | `backend/internal/models/fixedcost.go` | `backend/internal/cost/fixed_cost_model.go` | FixedCost Entity |
| | `backend/internal/models/specialcost.go` | `backend/internal/cost/special_cost_model.go` | SpecialCost Entity |
| | `backend/internal/storage/fixedcostsRepo.go` | `backend/internal/cost/repository/fixed_cost_repository.go` | FixedCost Repo Impl |
| | `backend/internal/storage/specialcostRepo.go` | `backend/internal/cost/repository/special_cost_repository.go` | SpecialCost Repo Impl |
| | `backend/internal/api/fixedcosts.go` | `backend/internal/cost/api/fixed_cost_handler.go` | |
| | `backend/internal/api/fixedcosts_test.go` | `backend/internal/cost/api/fixed_cost_handler_test.go` | |
| | `backend/internal/api/specialcosts.go` | `backend/internal/cost/api/special_cost_handler.go` | |
| | `backend/internal/api/specialcosts_test.go` | `backend/internal/cost/api/special_cost_handler_test.go` | |
| **Overview** | `backend/internal/api/overview.go` | `backend/internal/overview/api/handler.go` | Overview Handler |
| | `backend/internal/api/overview_test.go` | `backend/internal/overview/api/handler_test.go` | |
| | `backend/internal/models/statistics.go` | `backend/internal/overview/model/statistics.go` | Statistics Entity |
| | `backend/internal/api/statistics.go` | `backend/internal/overview/api/statistics_handler.go` | Statistics Handler |
| | `backend/internal/api/statistics_test.go` | `backend/internal/overview/api/statistics_handler_test.go` | |
| **Platform** | `backend/internal/storage/repository.go` | `backend/internal/platform/storage/repository.go` | Main Repository Interfaces |
| | `backend/internal/storage/mock_repository.go` | `backend/internal/platform/storage/mock_repository.go` | |
| | `backend/internal/storage/data_isolation_test.go` | `backend/internal/platform/storage/data_isolation_test.go` | |
| | `backend/internal/storage/migrations/` | `backend/internal/platform/storage/migrations/` | DB Migrations |
| | `backend/internal/platform/db/database.go` | `backend/internal/platform/db/database.go` | DB Connection (Unchanged) |
| | `backend/internal/api/server.go` | `backend/internal/platform/http/server.go` | HTTP Server & Wiring |
| | `backend/internal/api/middleware/` | `backend/internal/platform/http/middleware/` | HTTP Middleware |
| | `backend/internal/services/email_service.go` | `backend/internal/platform/email/service.go` | Infrastructure Service |
| | `backend/internal/models/yearmonth.go` | `backend/internal/platform/types/yearmonth.go` | Shared Value Object |
| | `backend/internal/models/yearmonth_test.go` | `backend/internal/platform/types/yearmonth_test.go` | |

## Critical Note on Repository Refactoring
Moving repository implementations (e.g., `userRepo.go`) to domain packages (`internal/user/repository/`) necessitates splitting the monolithic `GormRepository` struct.
- **Current:** `type GormRepository struct` (in `storage`) implements all methods.
- **New:** Each domain repository (e.g., `user.Repository`) will have its own implementation struct (e.g., `type PostgresRepository struct { DB *gorm.DB }` inside `internal/user/repository/`).
- **Impact:** This requires modifying `NewServer` and the `Server` struct in `platform/http/server.go` to wire these individual repositories instead of a single `storage.Repository`. This is a necessary structural change to fulfill the "Repositories in Domains" requirement.

## Execution Rules
1. **API Contract Preservation (CRITICAL)**: Use extreme caution to preserve all Struct Field Names and `json:"..."` tags exactly as they are. The frontend relies on these exact attribute names. **Do not change any struct fields or JSON tags.**
2. **Git Preservation**: Use `git mv` for all file relocations.
3. **Package Declarations**: Update `package` names to match the new folder structure.
4. **Import Updates**: Update all import paths.
5. **Logic Preservation**: Aside from the necessary Repository struct splitting/rewiring, no business logic (algorithms) will be changed.

## Verification
1. `go build ./...`
2. `go test ./...`

## Current Status (Updated - 2025-12-28)

### ✅ REFACTORING COMPLETE

All domain handlers and services have been refactored to the vertical slice architecture. The codebase is now organized by domain.

### Completed Domains

- **Auth Domain:**
    - ✅ Handlers moved to `internal/auth/api/`
    - ✅ JWT logic moved to `internal/auth/jwt.go`
    - ✅ Middleware moved to `internal/auth/middleware/`

- **User Domain:**
    - ✅ Model moved to `internal/user/model.go`
    - ✅ Handler moved to `internal/user/api/handler.go`
    - ✅ Service moved to `internal/user/service/service.go`

- **Wealth Domain:**
    - ✅ Models moved to `internal/wealth/` (profile.go, forecast.go)
    - ✅ Handlers moved to `internal/wealth/api/` (profile_handler.go, forecast_handler.go)
    - ✅ Services moved to `internal/wealth/service/` (profile_service.go, forecast_service.go)

- **Workspace Domain:**
    - ✅ Models moved to `internal/workspace/` (workspace.go, invite.go)
    - ✅ Handler moved to `internal/workspace/api/handler.go`
    - ✅ Services moved to `internal/workspace/service/` (workspace_service.go, invite_service.go, email_service.go)

- **Cost Domain:**
    - ✅ Models moved to `internal/cost/`
    - ✅ Repositories moved to `internal/cost/repository/`
    - ✅ Handlers moved to `internal/cost/api/`

- **Overview Domain:**
    - ✅ Handlers moved to `internal/overview/api/`
    - ✅ Statistics model moved to `internal/overview/model/`

- **Platform/Shared:**
    - ✅ `YearMonth` moved to `internal/platform/types/`
    - ✅ Database config in `internal/platform/db/`
    - ✅ Server wiring remains in `internal/api/server.go`

### Cleanup Completed
- ✅ `internal/models/` directory removed
- ✅ `internal/services/` directory removed
- ✅ All handlers refactored from Server methods to standalone Handler structs

### Remaining (Deferred)
The following items were deferred as they require more complex repository splitting:
- Repository implementations remain in `internal/storage/` due to `GormRepository` coupling
- Moving `internal/api/server.go` to `internal/platform/http/` (optional)

### Build & Test Status
- ✅ `go build ./...` passes
- ✅ `go test ./...` passes

### Warnings
- Shadowing: Watch out for package name `cost` being shadowed by local variables. Use `c` or `sc` for loop variables.
- Shadowing: Watch out for package name `workspace` being shadowed by local variables. Use `ws` for workspace variables.