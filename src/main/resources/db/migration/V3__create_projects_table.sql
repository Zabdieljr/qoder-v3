-- Create projects table for qoder-v3 application
-- This table stores project information and relationships to users

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    detailed_description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    repository_url TEXT,
    homepage_url TEXT,
    documentation_url TEXT,
    license VARCHAR(50),
    programming_languages TEXT[], -- Array of programming languages used
    tags TEXT[], -- Array of project tags/keywords
    status project_status DEFAULT 'ACTIVE',
    visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'INTERNAL')),
    is_template BOOLEAN DEFAULT FALSE,
    is_fork BOOLEAN DEFAULT FALSE,
    fork_parent_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    stars_count INTEGER DEFAULT 0,
    forks_count INTEGER DEFAULT 0,
    watchers_count INTEGER DEFAULT 0,
    issues_count INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT projects_name_not_empty CHECK (length(trim(name)) > 0),
    CONSTRAINT projects_slug_format CHECK (slug ~* '^[a-z0-9-]{3,255}$'),
    CONSTRAINT projects_stars_count_positive CHECK (stars_count >= 0),
    CONSTRAINT projects_forks_count_positive CHECK (forks_count >= 0),
    CONSTRAINT projects_watchers_count_positive CHECK (watchers_count >= 0),
    CONSTRAINT projects_issues_count_positive CHECK (issues_count >= 0)
);

-- Create indexes for performance optimization
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_visibility ON projects(visibility);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_is_template ON projects(is_template);
CREATE INDEX idx_projects_is_fork ON projects(is_fork);
CREATE INDEX idx_projects_fork_parent_id ON projects(fork_parent_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_last_activity_at ON projects(last_activity_at);
CREATE INDEX idx_projects_stars_count ON projects(stars_count DESC);

-- GIN indexes for array columns to support array operations
CREATE INDEX idx_projects_programming_languages ON projects USING GIN(programming_languages);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);

-- Full-text search index for project search functionality
CREATE INDEX idx_projects_search ON projects USING GIN(
    to_tsvector('english', 
        COALESCE(name, '') || ' ' || 
        COALESCE(description, '') || ' ' || 
        COALESCE(array_to_string(tags, ' '), '')
    )
);

-- Add update trigger for automatic timestamp management
CREATE TRIGGER set_timestamp_projects
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- Add table and column comments for documentation
COMMENT ON TABLE projects IS 'Project information and metadata for qoder-v3 application';
COMMENT ON COLUMN projects.id IS 'Primary key - UUID identifier for the project';
COMMENT ON COLUMN projects.name IS 'Display name of the project';
COMMENT ON COLUMN projects.slug IS 'URL-friendly identifier for the project';
COMMENT ON COLUMN projects.owner_id IS 'Foreign key reference to the user who owns this project';
COMMENT ON COLUMN projects.repository_url IS 'URL to the source code repository';
COMMENT ON COLUMN projects.programming_languages IS 'Array of programming languages used in the project';
COMMENT ON COLUMN projects.tags IS 'Array of tags/keywords associated with the project';
COMMENT ON COLUMN projects.visibility IS 'Project visibility level: PUBLIC, PRIVATE, or INTERNAL';
COMMENT ON COLUMN projects.is_template IS 'Whether this project can be used as a template';
COMMENT ON COLUMN projects.is_fork IS 'Whether this project is a fork of another project';
COMMENT ON COLUMN projects.fork_parent_id IS 'Reference to the parent project if this is a fork';
COMMENT ON COLUMN projects.last_activity_at IS 'Timestamp of the last activity on this project';