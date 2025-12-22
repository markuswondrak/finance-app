# Tasks: Wealth Extraction Option

**Feature**: 017-wealth-extraction
**Version**: 0.1.0

## Phase 1: Setup
*(No setup tasks required for this feature)*

## Phase 2: Foundational (Backend Logic)
**Goal**: Enable wealth calculation logic to support bi-directional flows (Saving vs Extraction) based on amount sign, instead of treating all `IsSaving` costs as wealth additions.

- [x] T001 [Backend] Create unit tests for `CalculateForecast` to verify wealth reduction for positive `IsSaving` amounts in `backend/internal/services/wealth_forecast_service_test.go`
- [x] T002 [Backend] Update `CalculateForecast` to subtract cost amount instead of adding absolute value in `backend/internal/services/wealth_forecast_service.go`
- [x] T003 [Backend] Verify `CalculateSurplus` in `backend/internal/api/statistics.go` treats positive amounts as income (no change expected, just verification)

## Phase 3: User Story 1 - Fixed Cost Wealth Extraction (Priority: P1)
**Goal**: Allow users to classify Fixed Costs as "Wealth Extraction".

- [x] T004 [US1] Update `frontend/src/components/common/Utils.js` to map `wealth_extraction` type to `isSaving: true, amount > 0`
- [x] T005 [US1] Update `frontend/src/components/editform/IncomingSelect.vue` to add "Entnahme" option (Blue) and change "Sparen" color to Amber
- [x] T006 [US1] Update `frontend/src/components/fixedcosts/FixedCostTable.vue` to render "Entnahme" icon (Blue) for `isSaving && amount > 0` and "Sparen" icon (Amber) for `isSaving && amount < 0`
- [x] T007 [US1] Update `frontend/src/components/fixedcosts/FixedCostsPage.vue` to ensure new types render correctly in all tabs

## Phase 4: User Story 2 - Special Cost Wealth Extraction (Priority: P1)
**Goal**: Allow users to classify Special Costs as "Wealth Extraction".

- [x] T008 [US2] Update `frontend/src/components/SpecialCostsPage.vue` to render "Entnahme" icon (Blue) and "Sparen" icon (Amber) in the list view
- [x] T009 [US2] Verify `SpecialCostForm.vue` correctly uses the updated `IncomingSelect` and saves Extraction costs

## Phase 5: Polish & Visuals
**Goal**: Ensure visual consistency and correct grouping in Overview.

- [x] T010 [US1] Update `frontend/src/finance.css` (or `main.js` theme config) to define/refine `text-warning` (Amber) and `text-info` (Blue) if not present
- [x] T011 [US1] Verify `frontend/src/components/overview/OverviewPage.vue` groups Wealth Extraction under Income section (via `amount > 0` logic)

## Implementation Strategy
- **MVP**: Complete Phase 2 and 3 to enable Fixed Cost extractions (pension use case).
- **Full**: Complete Phase 4 for ad-hoc withdrawals.
- **Visuals**: Do T005, T008, T010 together to ensure consistent color theme update (Blue/Amber swap).

## Dependencies
- Phase 3 requires Phase 2 (Backend logic must be correct before Frontend saves data).
- Phase 4 requires Phase 3 (reuses Utils/IncomingSelect).
- Phase 5 is cross-cutting but can be done alongside Phase 3/4.
