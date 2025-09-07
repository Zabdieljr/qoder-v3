-- Initial schema setup for qoder-v3 application
-- This migration creates the foundational database structure

-- Enable required extensions for UUID generation and cryptographic functions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create application schema (using public schema as configured)
-- The public schema is already available in PostgreSQL by default

-- Create audit columns function for automatic timestamp updates
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create an enum type for project status
CREATE TYPE project_status AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED', 'DELETED');

-- Create an enum type for user status
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- Comment on the database for documentation
COMMENT ON DATABASE postgres IS 'qoder-v3 application database - Supabase PostgreSQL instance';