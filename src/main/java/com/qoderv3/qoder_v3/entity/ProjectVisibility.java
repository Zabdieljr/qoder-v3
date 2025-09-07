package com.qoderv3.qoder_v3.entity;

/**
 * Enumeration representing the visibility level of a project.
 */
public enum ProjectVisibility {
    /**
     * Project is publicly visible to everyone
     */
    PUBLIC,
    
    /**
     * Project is private and only visible to authorized users
     */
    PRIVATE,
    
    /**
     * Project is internal to the organization
     */
    INTERNAL
}