# Data Model: User Onboarding Guide

**Feature**: 023-user-onboarding-guide
**Date**: 2025-12-30

## Entity Changes

### User (Extended)

**File**: `/backend/internal/user/model.go`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| OnboardingCompleted | bool | default: false | Tracks whether user has viewed/dismissed the onboarding guide |

**GORM Definition**:
```go
type User struct {
	ID                  uint      `json:"id" gorm:"primaryKey"`
	GoogleID            string    `json:"google_id" gorm:"unique"`
	Email               string    `json:"email" gorm:"unique"`
	Name                string    `json:"name"`
	AvatarURL           string    `json:"avatar_url"`
	CurrentAmount       int       `json:"current_amount"`
	WorkspaceID         uint      `json:"workspace_id"`
	OnboardingCompleted bool      `json:"onboarding_completed" gorm:"default:false"` // NEW
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}
```

**Migration Notes**:
- GORM AutoMigrate will add the column with default value `false`
- Existing users will have `onboarding_completed = false` after migration
- No data migration script needed

## State Transitions

### Onboarding Status

```
                    ┌─────────────────┐
                    │  User Created   │
                    │ (onboarding=    │
                    │   false)        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  First Login    │
                    │  Guide Shows    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐           ┌─────────────────┐
     │ User Completes  │           │  User Skips     │
     │    Guide        │           │    Guide        │
     └────────┬────────┘           └────────┬────────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  PATCH API      │
                    │  completed=true │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  onboarding=    │
                    │   true          │
                    │  (Guide hidden) │
                    └─────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Help Section   │
                    │  (On-demand     │
                    │   access)       │
                    └─────────────────┘
```

## Validation Rules

| Rule | Enforcement | Error Response |
|------|-------------|----------------|
| User must be authenticated | Middleware | 401 Unauthorized |
| Only boolean values accepted | JSON binding | 400 Bad Request |

## Relationships

No new relationships. The `OnboardingCompleted` field is a simple attribute on the existing User entity.

## Frontend Data Structures

### WizardStep (TypeScript/JSDoc)

```javascript
/**
 * @typedef {Object} WizardStep
 * @property {string} id - Unique step identifier
 * @property {string} title - Step title in German
 * @property {string} icon - FontAwesome icon class
 * @property {string} description - Feature description in German
 * @property {string} location - Where to find feature in navigation
 * @property {string[]} keyActions - List of main actions user can take
 */
```

### Guide Content (Static)

```javascript
const GUIDE_STEPS = [
  {
    id: 'welcome',
    title: 'Willkommen bei Finanz',
    icon: 'fa-hand-wave',
    description: 'Diese Anleitung zeigt dir die wichtigsten Funktionen der App.',
    location: null,
    keyActions: []
  },
  {
    id: 'overview',
    title: 'Überblick',
    icon: 'fa-chart-line',
    description: 'Hier siehst du deine finanzielle Prognose und deinen aktuellen Kontostand.',
    location: 'Erste Option in der Seitenleiste',
    keyActions: ['Kontostand bearbeiten', 'Prognose-Chart ansehen', 'Monatliche Übersicht']
  },
  {
    id: 'wealth',
    title: 'Vermögen',
    icon: 'fa-piggy-bank',
    description: 'Plane dein langfristiges Vermögenswachstum mit verschiedenen Szenarien.',
    location: 'Zweite Option in der Seitenleiste',
    keyActions: ['Aktuelles Vermögen eingeben', 'Zeithorizont festlegen', 'Rendite-Erwartungen setzen']
  },
  {
    id: 'save-to-spend',
    title: 'Spielraum',
    icon: 'fa-wallet',
    description: 'Sieh auf einen Blick, wie viel Geld du diesen Monat noch ausgeben kannst.',
    location: 'Dritte Option in der Seitenleiste',
    keyActions: ['Kontostand aktualisieren', 'Kosten als bezahlt markieren', 'Einmalkosten hinzufügen']
  },
  {
    id: 'fixed-costs',
    title: 'Fixkosten',
    icon: 'fa-money-check-dollar',
    description: 'Verwalte deine regelmäßigen Ausgaben wie Miete, Versicherungen und Abos.',
    location: 'Vierte Option in der Seitenleiste',
    keyActions: ['Monatliche Kosten hinzufügen', 'Quartals-/Halbjahres-/Jahreskosten', 'Kosten bearbeiten/löschen']
  },
  {
    id: 'special-costs',
    title: 'Sonderkosten',
    icon: 'fa-money-bill-wave',
    description: 'Erfasse einmalige Ausgaben und Sparziele.',
    location: 'Fünfte Option in der Seitenleiste',
    keyActions: ['Einmalige Ausgabe erfassen', 'Sparziel anlegen', 'Fälligkeitsdatum setzen']
  },
  {
    id: 'navigation',
    title: 'Navigation',
    icon: 'fa-bars',
    description: 'So findest du dich in der App zurecht.',
    location: null,
    keyActions: ['Seitenleiste ausklappen', 'Mobile: Hamburger-Menü nutzen', 'Hilfe jederzeit aufrufen']
  }
];
```

## Index Requirements

No new indexes needed. The `OnboardingCompleted` field is only queried as part of full user fetch (by ID), which is already indexed via primary key.
