package com.qoderv3.qoder_v3.entity;

/**
 * Enumeration representing the status of a project in the system.
 * This enum corresponds to the project_status type in the PostgreSQL database.
 */
public enum ProjectStatus {
    /**
     * Project is active and available for collaboration
     */
    ACTIVE,
    
    /**
     * Project is inactive but not deleted
     */
    INACTIVE,
    
    /**
     * Project has been archived for long-term storage
     */
    ARCHIVED,
    
    /**
     * Project is marked for deletion
     */
    DELETED
}