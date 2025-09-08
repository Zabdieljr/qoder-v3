-- Fix RLS Policies for Admin User Creation
-- Run this in your Supabase SQL Editor to allow initial admin setup

-- Drop the restrictive policies
DROP POLICY IF EXISTS "Allow admin setup" ON users;
DROP POLICY IF EXISTS "Allow signup" ON users;

-- Create a more permissive policy for initial setup
-- This allows any user (including anonymous) to insert during the initial setup phase
CREATE POLICY "Allow initial admin creation" 
ON users FOR INSERT 
TO public
WITH CHECK (true);

-- Also ensure anonymous users can insert (for the signup process)
CREATE POLICY "Allow signup for authenticated and anonymous" 
ON users FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Verify the policies were created
SELECT 
    policyname, 
    permissive,
    roles,
    cmd,
    with_check
FROM pg_policies 
WHERE tablename = 'users' AND cmd = 'INSERT';

-- Show current RLS status
SELECT 
    tablename, 
    rowsecurity,
    schemaname
FROM pg_tables 
WHERE tablename = 'users';