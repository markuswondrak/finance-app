package models

import (
	"time"
)

type Workspace struct {
	ID        uint   `gorm:"primaryKey"`
	Name      string `gorm:"not null"`
	CreatedAt time.Time
	UpdatedAt time.Time

	// Relationships
	Users      []User      `gorm:"foreignKey:WorkspaceID"`
	FixedCosts []FixedCost `gorm:"foreignKey:WorkspaceID"`
	Invites    []Invite    `gorm:"foreignKey:WorkspaceID"`
}

// WorkspaceUser is a junction table (optional if direct FK in User is sufficient, 
// but plan mentions it. However, the plan also says "User belongs to exactly one workspace"
// which implies a direct foreign key. 
// Checking plan again: "User (Updated): workspace_id (UUID, Foreign Key to Workspace): A user belongs to exactly one workspace."
// The plan also mentions "workspace_users junction table" in T001 description, but the data model says "Workspace 1:N User".
// I will stick to the 1:N relationship defined in the Data Model section of the plan and spec, which is simpler and fits the description better.
// The T001 description says "workspace_users junction table", but T003 says "Update User model to include workspace_id".
// This suggests a 1:N relationship. A junction table would be for N:M.
// Given "User... Now belongs to exactly one Workspace" in spec, I will assume 1:N and T001's mention of junction table might be a relic or for future N:M expansion.
// However, to strictly follow T001, I should consider if it implies a many-to-many relationship for the future?
// "User... Now belongs to exactly one Workspace" is very explicit.
// I will implement the Workspace struct to support the 1:N relationship as primary.
