-- ===================================================================
-- QODER V3 - COMPLETE SUPABASE DATABASE SETUP
-- ===================================================================
-- This script creates the complete database schema for the qoder-v3 application
-- Run this in your Supabase SQL Editor for a production-ready setup

-- ===================================================================
-- 1. EXTENSIONS AND FUNCTIONS
-- ===================================================================

-- Enable required extensions for UUID generation and cryptographic functions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create audit columns function for automatic timestamp updates
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- 2. ENUM TYPES
-- ===================================================================

-- Create enum type for user status
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum type for project status (for future use)
DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED', 'DELETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ===================================================================
-- 3. USERS TABLE
-- ===================================================================

-- Drop existing table if it exists (clean slate)
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with complete schema
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    github_username VARCHAR(50),
    status user_status DEFAULT 'ACTIVE',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints for data validation
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_username_format CHECK (username ~* '^[a-zA-Z0-9_-]{3,50}$')
);

-- ===================================================================
-- 4. INDEXES FOR PERFORMANCE
-- ===================================================================

-- Basic indexes for common queries
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email_verified ON users(email_verified);
CREATE INDEX idx_users_github_username ON users(github_username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Partial indexes for authentication tokens (only for non-null values)
CREATE INDEX idx_users_email_verification_token ON users(email_verification_token) 
    WHERE email_verification_token IS NOT NULL;
CREATE INDEX idx_users_password_reset_token ON users(password_reset_token) 
    WHERE password_reset_token IS NOT NULL;

-- ===================================================================
-- 5. TRIGGERS
-- ===================================================================

-- Add update trigger for automatic timestamp management
CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- ===================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ===================================================================

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow signup" ON users;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON users;

-- Create comprehensive RLS policies

-- Allow authenticated users to view their own profile
CREATE POLICY "Users can view own profile" 
    ON users FOR SELECT 
    TO authenticated 
    USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile" 
    ON users FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id);

-- Allow user registration (signup)
CREATE POLICY "Allow signup" 
    ON users FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = id);

-- Allow anonymous access for initial admin setup
CREATE POLICY "Allow admin setup" 
    ON users FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Allow authenticated users to select for user management features
CREATE POLICY "Allow select for authenticated users" 
    ON users FOR SELECT 
    TO authenticated 
    USING (true);

-- ===================================================================
-- 7. DOCUMENTATION
-- ===================================================================

-- Add comprehensive table and column comments
COMMENT ON TABLE users IS 'User accounts and authentication information for qoder-v3 application';
COMMENT ON COLUMN users.id IS 'Primary key - UUID identifier for the user';
COMMENT ON COLUMN users.username IS 'Unique username for login and display purposes';
COMMENT ON COLUMN users.email IS 'User email address - must be unique and verified';
COMMENT ON COLUMN users.password_hash IS 'Hashed password for local authentication (not used with Supabase Auth)';
COMMENT ON COLUMN users.first_name IS 'User first name';
COMMENT ON COLUMN users.last_name IS 'User last name';
COMMENT ON COLUMN users.full_name IS 'User full name (first + last)';
COMMENT ON COLUMN users.avatar_url IS 'URL to user profile picture';
COMMENT ON COLUMN users.bio IS 'User biography or description';
COMMENT ON COLUMN users.github_username IS 'GitHub username for OAuth integration';
COMMENT ON COLUMN users.status IS 'Current status of the user account';
COMMENT ON COLUMN users.email_verified IS 'Whether the email address has been verified';
COMMENT ON COLUMN users.email_verification_token IS 'Token for email verification process';
COMMENT ON COLUMN users.password_reset_token IS 'Token for password reset process';
COMMENT ON COLUMN users.password_reset_expires_at IS 'Expiration timestamp for password reset token';
COMMENT ON COLUMN users.last_login_at IS 'Timestamp of user last login';
COMMENT ON COLUMN users.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN users.updated_at IS 'Record last update timestamp (auto-updated by trigger)';

-- ===================================================================
-- 8. VERIFICATION AND TESTING
-- ===================================================================

-- Insert a test admin user to verify the schema works
INSERT INTO users (
    username, 
    email, 
    first_name, 
    last_name, 
    full_name, 
    status,
    email_verified
) VALUES (
    'admin_test',
    'admin@qoder.test',
    'Admin',
    'User',
    'Admin User',
    'ACTIVE',
    true
) ON CONFLICT (username) DO NOTHING;

-- Verify table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Show enum values
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname IN ('user_status', 'project_status')
ORDER BY t.typname, e.enumsortorder;

-- Verify policies
SELECT 
    schemaname,
    tablename, 
    policyname, 
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';

-- Test record count
SELECT COUNT(*) as total_users FROM users;

-- ===================================================================
-- SETUP COMPLETE
-- ===================================================================
-- The database is now ready for the qoder-v3 application!
-- 
-- Next steps:
-- 1. Verify all queries above returned expected results
-- 2. Check that the test admin user was created
-- 3. Confirm RLS policies are in place
-- 4. Test the admin user creation from the application
-- ===================================================================