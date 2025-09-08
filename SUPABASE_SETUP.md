# Supabase Database Setup Guide

This guide walks you through setting up the database for the Qoder V3 application.

## 🎯 Quick Setup

### Step 1: Access Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run Database Setup Script
Copy and paste the following SQL script:

```sql
-- Simple Supabase Setup for Qoder V3
-- This creates the minimal required tables and permissions

-- Create users table with essential fields
CREATE TABLE IF NOT EXISTS users (
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

-- Create policies for basic access
CREATE POLICY "Allow insert for authenticated users" 
ON users FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow select for authenticated users" 
ON users FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow update for own profile" 
ON users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
```

### Step 3: Verify Setup
1. Go to **Table Editor** in Supabase
2. Confirm you see a `users` table with the following columns:
   - id (uuid, Primary Key)
   - username (varchar)
   - email (varchar)
   - first_name (varchar)
   - last_name (varchar)
   - full_name (varchar)
   - status (text)
   - created_at (timestamptz)
   - updated_at (timestamptz)

### Step 4: Test Connection
1. Navigate to your frontend application
2. The database connection test should show all green statuses
3. Try creating the admin user

## 🔧 Troubleshooting

### "Column not found" errors
- Make sure you ran the SQL script completely
- Check that all columns exist in the Table Editor
- Verify RLS policies are properly set

### "Permission denied" errors
- Ensure RLS policies are created
- Check that authentication is working
- Verify the user has proper permissions

### Connection timeouts
- Check your Supabase project is active
- Verify environment variables are set correctly
- Ensure your project isn't paused

## 📊 Database Schema

The current schema supports:
- User account management
- Authentication integration
- Basic profile information
- Status tracking
- Audit timestamps

Future extensions will include:
- Projects table
- AI embeddings
- Additional user metadata

## 🔐 Security Notes

- Row Level Security (RLS) is enabled
- Users can only access their own data
- Admin operations require special permissions
- All operations are logged with timestamps

## 🚀 Next Steps

After successful database setup:
1. Test the admin user creation
2. Verify login functionality
3. Explore the user management interface
4. Check all CRUD operations work properly

---

**Need Help?** Check the main README.md for additional troubleshooting steps.