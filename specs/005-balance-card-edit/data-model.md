# Data Model: User Entity

## Entities

### User
Represents the application user. For this single-user application, only one record is expected.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| ID | uint | Primary Key | PK |
| CurrentAmount | int | The user's starting capital/balance (in whole Euros). | Not Null |
| CreatedAt | datetime | Creation timestamp | |
| UpdatedAt | datetime | Update timestamp | |
| DeletedAt | datetime | Soft delete timestamp | |

## Relationships
None.
