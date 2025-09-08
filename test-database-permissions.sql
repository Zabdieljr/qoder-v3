-- Quick test to verify RLS policies are working
-- Run this in Supabase SQL Editor

-- Check current user permissions
SELECT 
  current_user as current_db_user,
  session_user as session_user;

-- Check if RLS is enabled on users table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- List all policies on users table
SELECT 
  policyname,
  cmd as command,
  permissive,
  roles,
  qual as using_condition,
  with_check as with_check_condition
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- Test basic table access
SELECT COUNT(*) as total_users FROM users;

-- Show current auth user if available
SELECT auth.uid() as current_auth_user_id;