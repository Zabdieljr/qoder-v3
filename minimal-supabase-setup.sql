-- Ultra Simple Supabase Setup - Only Essential Columns
-- Run this in your Supabase SQL Editor

-- Drop existing table to start fresh
DROP TABLE IF EXISTS users CASCADE;

-- Create the absolute minimal users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'ACTIVE'
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create the most permissive policies for testing
CREATE POLICY "Allow all operations for everyone" 
ON users 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Test the table by inserting a record
INSERT INTO users (username, email, status) 
VALUES ('test_minimal', 'test_minimal@example.com', 'ACTIVE')
ON CONFLICT (username) DO NOTHING;

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Show the test record
SELECT * FROM users WHERE username = 'test_minimal';