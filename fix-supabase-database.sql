-- Complete Supabase Database Fix Script
-- Run this in your Supabase SQL Editor to fix column issues

-- First, drop the existing table if it has issues
DROP TABLE IF EXISTS users CASCADE;

-- Create the users table with all required columns
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100), 
    full_name VARCHAR(255),
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow update for own profile" ON users;

-- Create comprehensive policies
CREATE POLICY "Allow insert for authenticated users" 
ON users FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow insert for anonymous users" 
ON users FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow select for authenticated users" 
ON users FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow select for anonymous users" 
ON users FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Allow update for own profile" 
ON users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Insert a test record to verify structure
INSERT INTO users (
    username, 
    email, 
    first_name, 
    last_name, 
    full_name, 
    status
) VALUES (
    'test_user',
    'test@example.com',
    'Test',
    'User',
    'Test User',
    'ACTIVE'
) ON CONFLICT (username) DO NOTHING;

-- Show table structure to verify
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;