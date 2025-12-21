# finance-app Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-16

## Active Technologies
- Vue.js 3.3+ (Frontend only) + Vuetify 3.3+, Javascript (ES6+) (007-lowest-point-risk-card)
- N/A (Frontend derived state) (007-lowest-point-risk-card)
- Go 1.17+ (Backend), Vue.js 3.3+ (Frontend) + Gin (Go), GORM (Go), Vuetify 3.3+ (Vue) (008-special-costs-page)
- PostgreSQL 15+ (Existing schema) (008-special-costs-page)
- Vue.js 3.3+ (Frontend) + Vuetify 3.3+ (UI), Vue Router 4.2+ (Routing) (011-landing-page)
- N/A (Frontend-only state/mock data) (011-landing-page)
- Go 1.17+ (Backend), Vue.js 3.3+ (Frontend) + Gin, GORM (Backend); Vuetify 3.3+, Vue Router 4.2+ (Frontend) (013-fixed-cost-savings)
- Backend: Go 1.17+, Frontend: Vue.js 3.3+ (Javascript ES6+) + Backend: Gin, GORM. Frontend: Vuetify 3.3+, Vue Router 4.2+ (014-wealth-profile-config)
- PostgreSQL 15+ (New table `wealth_profiles`) (014-wealth-profile-config)
- Go 1.17+, Vue.js 3.3+ + Gin (Go), GORM (Go), Vuetify 3.3+, Chart.js 4.4+ (vue-chartjs) (015-wealth-forecast-chart)
- PostgreSQL 15+ (Read-only for this feature) (015-wealth-forecast-chart)
- Go 1.17+ (Backend), Vue.js 3.3+ (Frontend) + Gin (Go), Vuetify 3.3+, Chart.js (interaction) (016-wealth-forecast-table)
- N/A (Read-only data from existing Forecast logic) (016-wealth-forecast-table)

- Backend: Go 1.17+, Frontend: Vue.js 3.3+ + Backend: Gin, GORM. Frontend: Vuetify 3.3+, Chart.js 4.4+ (vue-chartjs), Vue Router 4.2+ (006-surplus-card-sparkline)

## Project Structure

```text
src/
tests/
```

## Commands

# Add commands for Backend: Go 1.17+, Frontend: Vue.js 3.3+

## Code Style

Backend: Go 1.17+, Frontend: Vue.js 3.3+: Follow standard conventions

## Recent Changes
- 016-wealth-forecast-table: Added Go 1.17+ (Backend), Vue.js 3.3+ (Frontend) + Gin (Go), Vuetify 3.3+, Chart.js (interaction)
- 015-wealth-forecast-chart: Added Go 1.17+, Vue.js 3.3+ + Gin (Go), GORM (Go), Vuetify 3.3+, Chart.js 4.4+ (vue-chartjs)
- 014-wealth-profile-config: Added Backend: Go 1.17+, Frontend: Vue.js 3.3+ (Javascript ES6+) + Backend: Gin, GORM. Frontend: Vuetify 3.3+, Vue Router 4.2+


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
