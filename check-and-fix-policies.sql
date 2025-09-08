-- Check and fix RLS policies safely
-- Run this in Supabase SQL Editor

-- First, let's check what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- Drop existing conflicting policies if they exist (to recreate them properly)
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin can update any profile" ON users;

-- Create the policies with proper conditions
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can update any profile" 
ON users FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND username = 'zarenas'
  )
);

-- Ensure proper grants
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;

-- Check if policies were created successfully
SELECT 'Policies created successfully:' as status;
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE tablename = 'users' AND cmd = 'UPDATE'
ORDER BY policyname;