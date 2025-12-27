package migrations

import (
	"fmt"
	"wondee/finance-app-backend/internal/models"

	"gorm.io/gorm"
)

// PreMigrateWorkspaces adds workspace_id columns as nullable before AutoMigrate runs.
// This allows existing data to be preserved before backfilling.
func PreMigrateWorkspaces(db *gorm.DB) error {
	// First, ensure the workspaces table exists
	if !db.Migrator().HasTable(&models.Workspace{}) {
		if err := db.Migrator().CreateTable(&models.Workspace{}); err != nil {
			return fmt.Errorf("failed to create workspaces table: %w", err)
		}
	}

	// Add workspace_id column to users if it doesn't exist (as nullable INTEGER)
	if !db.Migrator().HasColumn(&models.User{}, "workspace_id") {
		if err := db.Exec("ALTER TABLE users ADD COLUMN workspace_id INTEGER").Error; err != nil {
			return fmt.Errorf("failed to add workspace_id to users: %w", err)
		}
	}

	// Add workspace_id column to fixed_costs if it doesn't exist (as nullable INTEGER)
	if !db.Migrator().HasColumn(&models.FixedCost{}, "workspace_id") {
		if err := db.Exec("ALTER TABLE fixed_costs ADD COLUMN workspace_id INTEGER").Error; err != nil {
			return fmt.Errorf("failed to add workspace_id to fixed_costs: %w", err)
		}
	}

	// Add workspace_id column to special_costs if it doesn't exist (as nullable INTEGER)
	if !db.Migrator().HasColumn(&models.SpecialCost{}, "workspace_id") {
		if err := db.Exec("ALTER TABLE special_costs ADD COLUMN workspace_id INTEGER").Error; err != nil {
			return fmt.Errorf("failed to add workspace_id to special_costs: %w", err)
		}
	}

	// Add workspace_id column to wealth_profiles if it doesn't exist (as nullable INTEGER)
	if !db.Migrator().HasColumn(&models.WealthProfile{}, "workspace_id") {
		if err := db.Exec("ALTER TABLE wealth_profiles ADD COLUMN workspace_id INTEGER").Error; err != nil {
			return fmt.Errorf("failed to add workspace_id to wealth_profiles: %w", err)
		}
	}

	return nil
}

// BackfillWorkspaces creates workspaces for existing users and links their data.
// Uses a simple approach: workspace_id = user_id for easy migration.
// This must run AFTER PreMigrateWorkspaces and BEFORE AutoMigrate adds NOT NULL constraints.
func BackfillWorkspaces(db *gorm.DB) error {
	var users []models.User
	// Find users with nil/empty workspace ID
	if err := db.Where("workspace_id IS NULL OR workspace_id = 0").Find(&users).Error; err != nil {
		return err
	}

	for _, user := range users {
		fmt.Printf("Migrating user %s (ID: %d) to new workspace with ID %d...\n", user.Name, user.ID, user.ID)

		// Create Workspace with ID = User ID (simple 1:1 mapping)
		workspace := models.Workspace{
			ID:   user.ID, // Use same ID as user for simple migration
			Name: fmt.Sprintf("%s's Workspace", user.Name),
		}
		if workspace.Name == "'s Workspace" {
			workspace.Name = "My Workspace"
		}

		if err := db.Create(&workspace).Error; err != nil {
			return fmt.Errorf("failed to create workspace for user %d: %w", user.ID, err)
		}

		// Update User - workspace_id = user_id
		if err := db.Model(&models.User{}).Where("id = ?", user.ID).Update("workspace_id", user.ID).Error; err != nil {
			return fmt.Errorf("failed to assign workspace to user %d: %w", user.ID, err)
		}

		// Update Fixed Costs - workspace_id = user_id
		if err := db.Model(&models.FixedCost{}).Where("user_id = ?", user.ID).Update("workspace_id", user.ID).Error; err != nil {
			return fmt.Errorf("failed to migrate fixed costs for user %d: %w", user.ID, err)
		}

		// Update Special Costs - workspace_id = user_id
		if err := db.Model(&models.SpecialCost{}).Where("user_id = ?", user.ID).Update("workspace_id", user.ID).Error; err != nil {
			return fmt.Errorf("failed to migrate special costs for user %d: %w", user.ID, err)
		}

		// Update Wealth Profile - workspace_id = user_id
		if err := db.Model(&models.WealthProfile{}).Where("user_id = ?", user.ID).Update("workspace_id", user.ID).Error; err != nil {
			return fmt.Errorf("failed to migrate wealth profile for user %d: %w", user.ID, err)
		}
	}

	return nil
}
