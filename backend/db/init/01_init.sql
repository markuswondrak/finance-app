-- Initial database setup for finance-app
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Database is already created via POSTGRES_DB environment variable
-- Tables will be created automatically by GORM AutoMigrate in main.go

-- Optional: Create extensions if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Optional: Insert seed data for development
-- INSERT INTO fixed_costs (name, amount, ...) VALUES ('Example Cost', 100.00, ...);

-- Add any other initialization SQL here
