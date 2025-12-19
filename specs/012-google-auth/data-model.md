# Data Model: Google Authentication

**Feature**: 012-google-auth
**Based on**: `specs/012-google-auth/spec.md`

## Entities

### User

Represents a registered application user authenticated via Google.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ID` | `uint` | Yes | Primary Key (Auto-increment) |
| `GoogleID` | `string` | Yes | Unique identifier from Google |
| `Email` | `string` | Yes | User's email address (Unique) |
| `Name` | `string` | Yes | User's full name from Google profile |
| `AvatarURL` | `string` | No | URL to user's avatar image |
| `CreatedAt` | `datetime` | Yes | Timestamp of account creation |
| `UpdatedAt` | `datetime` | Yes | Timestamp of last update |

**Constraints**:
- `GoogleID` must be unique.
- `Email` must be unique.

### FixedCost (Update)

Existing entity. Now belongs to a User.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ... | ... | ... | Existing fields |
| `UserID` | `uint` | Yes | Foreign Key to User |

**Relationships**:
- Belongs to `User` (`OnDelete: CASCADE` recommended to clean up data if user is deleted).

### SpecialCost (Update)

Existing entity. Now belongs to a User.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ... | ... | ... | Existing fields |
| `UserID` | `uint` | Yes | Foreign Key to User |

**Relationships**:
- Belongs to `User` (`OnDelete: CASCADE` recommended).

## Relationships Diagram

```mermaid
erDiagram
    User ||--o{ FixedCost : "owns"
    User ||--o{ SpecialCost : "owns"

    User {
        uint ID PK
        string GoogleID UK
        string Email UK
        string Name
        string AvatarURL
        datetime CreatedAt
        datetime UpdatedAt
    }

    FixedCost {
        uint ID PK
        uint UserID FK
        ... existing_fields
    }

    SpecialCost {
        uint ID PK
        uint UserID FK
        ... existing_fields
    }
```
