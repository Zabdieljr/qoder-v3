# Qoder V3 - Complete Supabase Database Setup Guide

This guide walks you through setting up the complete, production-ready database schema for the Qoder V3 application.

## 🎯 Overview

The complete setup includes:
- **Extensions**: UUID generation and cryptographic functions
- **Enums**: User and project status types
- **Users Table**: Complete schema with all columns
- **Indexes**: Performance optimization
- **Triggers**: Automatic timestamp updates
- **RLS Policies**: Comprehensive security
- **Documentation**: Full schema documentation
- **Verification**: Test data and structure validation

## 🔧 Step-by-Step Setup

### Step 1: Access Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project (`kmcuhicgzwdcalnyywgo`)
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Complete Setup Script
1. Copy the entire content from `complete-supabase-setup.sql`
2. Paste it into the SQL editor
3. Click **Run** to execute the script
4. Wait for completion (should take 10-30 seconds)

### Step 3: Verify the Setup

After running the script, you should see several result tables:

#### ✅ **Table Structure Verification**
Should show 18 columns including:
- id (uuid)
- username (character varying)
- email (character varying) 
- first_name (character varying)
- last_name (character varying)
- full_name (character varying)
- status (user_status enum)
- email_verified (boolean)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)
- And more...

#### ✅ **Enum Values Verification**
Should show:
- user_status: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION
- project_status: ACTIVE, INACTIVE, ARCHIVED, DELETED

#### ✅ **RLS Policies Verification**
Should show 5 policies:
- Users can view own profile
- Users can update own profile
- Allow signup
- Allow admin setup
- Allow select for authenticated users

#### ✅ **Test User Verification**
Should show: `total_users: 1` (the test admin user)

### Step 4: Test Admin Creation
1. Go to your frontend application
2. Try clicking **"Create Admin User"**
3. It should now work successfully!

## 📊 Database Schema Details

### Users Table Structure
```sql
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Key Features
- **UUID Primary Keys**: Standard for distributed systems
- **Enum Types**: Type-safe status values
- **Constraints**: Email and username validation
- **Indexes**: Optimized for common queries
- **Triggers**: Automatic timestamp updates
- **RLS**: Row-level security for data protection

## 🔐 Security Features

### Row Level Security (RLS)
- **Enabled by default** for all tables
- **User isolation**: Users can only see their own data
- **Admin access**: Special policies for admin operations
- **Signup protection**: Controlled user registration

### Authentication Integration
- **Supabase Auth**: Integrated with auth.users
- **Profile sync**: User profiles linked to auth records
- **Token management**: Email verification and password reset

## 🚀 Performance Optimizations

### Indexes Created
- `idx_users_username` - Username lookups
- `idx_users_email` - Email searches
- `idx_users_status` - Status filtering
- `idx_users_email_verified` - Verification queries
- `idx_users_github_username` - OAuth integration
- `idx_users_created_at` - Time-based queries
- Partial indexes for tokens (only non-null values)

### Automatic Features
- **Timestamp triggers**: Auto-update `updated_at`
- **UUID generation**: Automatic ID assignment
- **Default values**: Sensible defaults for all fields

## 🔧 Troubleshooting

### Common Issues

**Script execution errors**:
- Ensure you have admin privileges in Supabase
- Check for existing conflicting objects
- Run the complete script in one execution

**Column not found errors**:
- Verify the script completed successfully
- Check all result tables are displayed
- Refresh the Table Editor to see new schema

**Permission denied errors**:
- Ensure RLS policies were created
- Check that auth is working properly
- Verify user authentication status

### Verification Commands

Run these in SQL Editor to verify setup:

```sql
-- Check table exists and has correct structure
\d users;

-- Verify enum types exist
SELECT typname FROM pg_type WHERE typname IN ('user_status', 'project_status');

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';

-- Verify policies exist
SELECT policyname FROM pg_policies WHERE tablename = 'users';
```

## 📈 Next Steps

After successful database setup:

1. **Test admin user creation** in the frontend
2. **Verify login functionality** works
3. **Explore user management** features
4. **Check CRUD operations** work properly
5. **Review security policies** for your needs
6. **Consider additional tables** for your application

## 🔄 Future Enhancements

The schema is designed to support:
- **Projects table** (already planned)
- **AI embeddings** (for semantic search)
- **OAuth providers** (GitHub, Google, etc.)
- **User roles and permissions**
- **Activity logging**
- **File attachments**

---

**Need Help?** Check the console logs in your browser developer tools for detailed error information if issues persist.