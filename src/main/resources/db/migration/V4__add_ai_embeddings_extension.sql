-- Add AI embeddings support for qoder-v3 application
-- This migration enables vector storage for AI/ML features using PostgresML

-- Enable vector extension for AI embeddings (pgvector)
-- Note: This extension might need to be enabled at the database level in Supabase
CREATE EXTENSION IF NOT EXISTS vector;

-- Create content types enum for embeddings
CREATE TYPE embedding_content_type AS ENUM (
    'PROJECT_DESCRIPTION',
    'PROJECT_DOCUMENTATION', 
    'CODE_SNIPPET',
    'USER_PROFILE',
    'COMMIT_MESSAGE',
    'ISSUE_DESCRIPTION',
    'PULL_REQUEST_DESCRIPTION',
    'COMMENT'
);

-- Create embeddings table for AI features
CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type embedding_content_type NOT NULL,
    content_text TEXT NOT NULL,
    embedding_vector vector(1536), -- OpenAI ada-002 dimension
    embedding_model VARCHAR(100) DEFAULT 'text-embedding-ada-002',
    chunk_index INTEGER DEFAULT 0, -- For large content split into chunks
    chunk_total INTEGER DEFAULT 1,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT embeddings_chunk_index_positive CHECK (chunk_index >= 0),
    CONSTRAINT embeddings_chunk_total_positive CHECK (chunk_total >= 1),
    CONSTRAINT embeddings_chunk_index_less_than_total CHECK (chunk_index < chunk_total),
    CONSTRAINT embeddings_content_text_not_empty CHECK (length(trim(content_text)) > 0)
);

-- Create indexes for vector similarity search and performance
CREATE INDEX idx_embeddings_content_id ON embeddings(content_id);
CREATE INDEX idx_embeddings_content_type ON embeddings(content_type);
CREATE INDEX idx_embeddings_created_at ON embeddings(created_at);
CREATE INDEX idx_embeddings_model ON embeddings(embedding_model);

-- Create vector similarity search index using ivfflat
-- This index enables fast approximate nearest neighbor search
CREATE INDEX idx_embeddings_vector_cosine ON embeddings 
USING ivfflat (embedding_vector vector_cosine_ops) WITH (lists = 100);

-- Alternative index for L2 distance (Euclidean)
CREATE INDEX idx_embeddings_vector_l2 ON embeddings 
USING ivfflat (embedding_vector vector_l2_ops) WITH (lists = 100);

-- Create GIN index for metadata JSONB queries
CREATE INDEX idx_embeddings_metadata ON embeddings USING GIN(metadata);

-- Create composite indexes for common query patterns
CREATE INDEX idx_embeddings_content_type_id ON embeddings(content_type, content_id);
CREATE INDEX idx_embeddings_content_model ON embeddings(content_type, embedding_model);

-- Add update trigger for automatic timestamp management
CREATE TRIGGER set_timestamp_embeddings
    BEFORE UPDATE ON embeddings
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- Create a function for similarity search
CREATE OR REPLACE FUNCTION find_similar_embeddings(
    query_vector vector(1536),
    content_type_filter embedding_content_type DEFAULT NULL,
    similarity_threshold FLOAT DEFAULT 0.7,
    max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    content_id UUID,
    content_type embedding_content_type,
    content_text TEXT,
    similarity FLOAT,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.content_id,
        e.content_type,
        e.content_text,
        1 - (e.embedding_vector <=> query_vector) AS similarity,
        e.metadata
    FROM embeddings e
    WHERE 
        (content_type_filter IS NULL OR e.content_type = content_type_filter)
        AND (1 - (e.embedding_vector <=> query_vector)) >= similarity_threshold
    ORDER BY e.embedding_vector <=> query_vector
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get embeddings statistics
CREATE OR REPLACE FUNCTION get_embeddings_stats()
RETURNS TABLE (
    content_type embedding_content_type,
    total_count BIGINT,
    avg_vector_length FLOAT,
    last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.content_type,
        COUNT(*) as total_count,
        AVG(array_length(e.embedding_vector::REAL[], 1))::FLOAT as avg_vector_length,
        MAX(e.updated_at) as last_updated
    FROM embeddings e
    GROUP BY e.content_type
    ORDER BY e.content_type;
END;
$$ LANGUAGE plpgsql;

-- Add table and column comments for documentation
COMMENT ON TABLE embeddings IS 'Vector embeddings storage for AI/ML features in qoder-v3';
COMMENT ON COLUMN embeddings.id IS 'Primary key - UUID identifier for the embedding';
COMMENT ON COLUMN embeddings.content_id IS 'Reference to the source content (project, user, etc.)';
COMMENT ON COLUMN embeddings.content_type IS 'Type of content that was embedded';
COMMENT ON COLUMN embeddings.content_text IS 'Original text content that was embedded';
COMMENT ON COLUMN embeddings.embedding_vector IS 'High-dimensional vector representation of the content';
COMMENT ON COLUMN embeddings.embedding_model IS 'AI model used to generate the embedding';
COMMENT ON COLUMN embeddings.chunk_index IS 'Index of this chunk if content was split';
COMMENT ON COLUMN embeddings.chunk_total IS 'Total number of chunks for this content';
COMMENT ON COLUMN embeddings.metadata IS 'Additional metadata about the embedding in JSON format';

COMMENT ON FUNCTION find_similar_embeddings IS 'Find embeddings similar to a query vector using cosine similarity';
COMMENT ON FUNCTION get_embeddings_stats IS 'Get statistics about stored embeddings by content type';