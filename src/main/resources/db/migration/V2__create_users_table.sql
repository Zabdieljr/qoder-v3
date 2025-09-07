-- Create users table for qoder-v3 application
-- This table stores user account information and authentication details

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
    
    -- Constraints
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_username_format CHECK (username ~* '^[a-zA-Z0-9_-]{3,50}$')
);

-- Create indexes for performance optimization
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email_verified ON users(email_verified);
CREATE INDEX idx_users_github_username ON users(github_username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Create partial indexes for authentication tokens (only for non-null values)
CREATE INDEX idx_users_email_verification_token ON users(email_verification_token) 
    WHERE email_verification_token IS NOT NULL;
CREATE INDEX idx_users_password_reset_token ON users(password_reset_token) 
    WHERE password_reset_token IS NOT NULL;

-- Add update trigger for automatic timestamp management
CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- Add table and column comments for documentation
COMMENT ON TABLE users IS 'User accounts and authentication information for qoder-v3 application';
COMMENT ON COLUMN users.id IS 'Primary key - UUID identifier for the user';
COMMENT ON COLUMN users.username IS 'Unique username for login and display purposes';
COMMENT ON COLUMN users.email IS 'User email address - must be unique and verified';
COMMENT ON COLUMN users.password_hash IS 'Hashed password for local authentication';
COMMENT ON COLUMN users.status IS 'Current status of the user account';
COMMENT ON COLUMN users.email_verified IS 'Whether the email address has been verified';
COMMENT ON COLUMN users.github_username IS 'GitHub username for OAuth integration';
COMMENT ON COLUMN users.avatar_url IS 'URL to user profile picture';
COMMENT ON COLUMN users.bio IS 'User biography or description';