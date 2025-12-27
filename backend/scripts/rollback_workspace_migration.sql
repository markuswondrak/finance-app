-- Rollback script for workspace migration
-- This reverts the database to the state before the shared workspace feature

-- Step 1: Drop workspace_id columns from all tables (if they exist)
ALTER TABLE users DROP COLUMN IF EXISTS workspace_id;
ALTER TABLE fixed_costs DROP COLUMN IF EXISTS workspace_id;
ALTER TABLE special_costs DROP COLUMN IF EXISTS workspace_id;
ALTER TABLE wealth_profiles DROP COLUMN IF EXISTS workspace_id;

-- Step 2: Drop the invites table (if it exists)
DROP TABLE IF EXISTS invites;

-- Step 3: Drop the workspaces table (if it exists)
DROP TABLE IF EXISTS workspaces;

-- Verify the rollback
SELECT 'Rollback complete. Verify with:' AS status;
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_name IN ('users', 'fixed_costs', 'special_costs', 'wealth_profiles')
  AND column_name = 'workspace_id';
