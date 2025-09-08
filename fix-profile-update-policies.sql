-- Fix RLS policies for profile updates
-- Run this in Supabase SQL Editor

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow admin to update any profile
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

-- Ensure the users table has proper permissions
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON users TO anon;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';