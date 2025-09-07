package com.qoderv3.qoder_v3.entity;

/**
 * Enumeration representing different types of content that can be embedded.
 * This enum corresponds to the embedding_content_type type in the PostgreSQL database.
 */
public enum EmbeddingContentType {
    /**
     * Project description text
     */
    PROJECT_DESCRIPTION,
    
    /**
     * Project documentation content
     */
    PROJECT_DOCUMENTATION,
    
    /**
     * Source code snippet
     */
    CODE_SNIPPET,
    
    /**
     * User profile information
     */
    USER_PROFILE,
    
    /**
     * Git commit message
     */
    COMMIT_MESSAGE,
    
    /**
     * Issue description or content
     */
    ISSUE_DESCRIPTION,
    
    /**
     * Pull request description or content
     */
    PULL_REQUEST_DESCRIPTION,
    
    /**
     * Comment text
     */
    COMMENT
}