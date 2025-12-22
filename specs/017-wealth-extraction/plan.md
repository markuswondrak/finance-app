# Technical Implementation Plan: Wealth Extraction Option

**Feature**: Wealth Extraction Option
**Branch**: `017-wealth-extraction`
**Spec**: `specs/017-wealth-extraction/spec.md`
**Version**: 0.1.0

## 1. Technical Context

### Current Architecture

- **Backend (Go)**:
  - `FixedCost` and `SpecialCost` structs defined in `backend/internal/models`.
  - Categories are likely strings or enums.
  - Wealth and Surplus calculations are performed in services (likely `services.calculations` or similar).
- **Frontend (Vue.js)**:
  - `FixedCostsPage.vue` and `SpecialCostsPage.vue` handle listing and editing.
  - Categories are hardcoded or fetched from a config.
  - Color mapping for categories is defined in CSS/JS constants or Vuetify themes.

### Proposed Changes

1.  **Backend Models**:
    - Verify `FixedCost` and `SpecialCost` category fields can accept "Wealth Extraction" (string vs enum).
    - No schema change likely needed if category is a string.
2.  **Calculation Logic**:
    - **Surplus**: Treat "Wealth Extraction" as Income (+) for monthly surplus.
    - **Wealth**: Treat "Wealth Extraction" as a reduction (-) from total wealth.
    - **Lowest Point**: Include "Wealth Extraction" as liquid inflow (+).
3.  **Frontend UI**:
    - **Dropdowns**: Add "Wealth Extraction" to category selectors in `FixedCostsPage` and `SpecialCostsPage`.
    - **Visuals**:
        - "Wealth Extraction" = **Blue** (new definition) + `fa-money-bill-transfer`.
        - "Saving" = **Amber** (refactor from Blue).
        - Update icons/colors in lists and dashboards.
4.  **Overview Page**:
    - Group "Wealth Extraction" under "Income" section.

### Unknowns & Risks

- **Category Implementation**: Is `category` a strict Go enum or a string? If enum, need to update the definition.
- **Wealth Calculation Location**: Where exactly is the global wealth reduction calculated? Need to find the specific service method.
- **Surplus Calculation**: Need to ensure "Wealth Extraction" doesn't double-count or be missed in `CalculateSurplus`.
- **Lowest Point Logic**: Confirm where the "lowest point" logic resides to inject the new inflow type.

## 2. Constitution Check

| Principle | Status | Notes |
| :--- | :--- | :--- |
| **I. Simplicity** | ✅ | Reuses existing cost structures; adds a simple type. |
| **II. UX Excellence** | ✅ | distinct visual cues (Blue/Amber swap) aid clarity. |
| **III. Separation** | ✅ | Backend handles logic; Frontend handles presentation. |
| **IV. Tests** | ⚠️ | **Plan**: Add unit tests for new calculation logic; component tests for UI selectors. |
| **V. API-First** | ✅ | Uses existing cost endpoints; payload just has a new string value. |
| **VI. Data Integrity** | ✅ | Standard validation applies. |
| **VII. Visuals** | ✅ | Explicitly defines color/icon schema. |
| **VIII. Frontend Arch** | ✅ | Changes localized to specific page components. |

## 3. Phase 0: Research & Discovery

### Research Tasks

1.  **Analyze Backend Models**: Check `backend/internal/models/fixed_cost.go` and `special_cost.go` for category type definitions.
2.  **Locate Calculation Logic**: Find the services responsible for `CalculateSurplus`, `CalculateWealth`, and `CalculateLowestPoint`.
    - Search for "Income", "Expense" strings in `backend/internal/services/`.
3.  **Frontend Constants**: Find where category colors and options are defined in the frontend (likely a composable or constants file).

### Research Findings (Pre-filled for Plan)

*Note: I will perform the research now to fill this section.*

**Goal**: Determine exact integration points for "Wealth Extraction".

## 4. Phase 1: Technical Design

### Data Model Changes (`data-model.md`)

- **FixedCost / SpecialCost**: No schema change expected (assuming string category).
- **Validation**: Ensure "Wealth Extraction" is a valid category string if enums are used.

### API Contract (`contracts/`)

- No new endpoints.
- Payload for `POST/PUT /api/fixed-costs` and `/api/special-costs` accepts `category: "wealth_extraction"`.

### Logic Updates

1.  **Surplus Service**:
    - Logic: `Income + Wealth Extraction - Expenses`.
2.  **Wealth Service**:
    - Logic: `Previous Wealth + Savings - Wealth Extraction + Investment Growth`.
3.  **Risk Service (Lowest Point)**:
    - Logic: `Initial Balance + Income + Wealth Extraction - Expenses (day by day)`.

### Frontend Updates

1.  **Constants**: Update category list and color/icon maps.
2.  **FixedCostsPage**: Ensure generic category selector picks up the new option.
3.  **SpecialCostsPage**: Ditto.
4.  **OverviewPage**: Update grouping logic to bundle `wealth_extraction` with `income`.

## 5. Phase 2: Implementation Plan

### Step 1: Backend Logic Update (Go)

- **Goal**: Enable Wealth Extraction calculation support.
- **Task**: Modify `backend/internal/services/wealth_forecast_service.go` in `CalculateForecast`.
  - Change `monthlySaving += math.Abs(...)` to `monthlySaving -= cost.Amount`.
  - Change `specialSavingsMap[*cost.DueDate] += math.Abs(...)` to `specialSavingsMap[*cost.DueDate] -= cost.Amount`.
  - **Verification**: `go test ./internal/services/...` (Create new test case: `TestCalculateForecast_WithExtraction`).

### Step 2: Frontend Constants & Utils (Vue)

- **Goal**: Support "Wealth Extraction" type in logic.
- **Task**: Update `frontend/src/components/common/Utils.js`.
  - `monthlyCostToForm`: Map `isSaving: true, amount > 0` -> `type: 'wealth_extraction'`.
  - `baseFormToCost`: Map `type: 'wealth_extraction'` -> `isSaving: true, amount: +Value`.
- **Task**: Update `frontend/src/components/editform/IncomingSelect.vue`.
  - Add `v-btn` for `value="wealth_extraction"`.
  - Style with **Blue** color.
  - Change "Saving" button color to **Amber**.

### Step 3: Frontend Visuals (Vue)

- **Goal**: Visual distinction in lists.
- **Task**: Update `FixedCostTable.vue` and `SpecialCostList.vue` (or wherever icons are rendered).
  - Logic: If `isSaving && amount > 0` -> Show "Entnahme" icon (Blue).
  - Logic: If `isSaving && amount < 0` -> Show "Sparen" icon (Amber).
- **Task**: Global CSS/Vuetify theme updates for "Saving" (Amber) vs "Extraction" (Blue).

### Step 4: Overview & Integration

- **Goal**: Ensure Surplus and Overview reflect the change.
- **Task**: Verify `CalculateSurplus` (Backend) naturally picks it up as Income (it should).
- **Task**: Update Frontend Overview to group these under "Income" if they aren't already grouped by `amount > 0`.
- **Manual Verification**: Run full app, add Extraction, check all 3 cards (Balance, Surplus, Wealth).

## 6. Artifact Generation

- `data-model.md`: Completed.
- `contracts/`: N/A.
- `research.md`: Completed.
- `quickstart.md`: Completed.
