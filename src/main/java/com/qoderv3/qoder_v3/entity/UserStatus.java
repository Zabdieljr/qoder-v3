package com.qoderv3.qoder_v3.entity;

/**
 * Enumeration representing the status of a user account in the system.
 * This enum corresponds to the user_status type in the PostgreSQL database.
 */
public enum UserStatus {
    /**
     * User account is active and fully functional
     */
    ACTIVE,
    
    /**
     * User account is inactive (temporarily disabled)
     */
    INACTIVE,
    
    /**
     * User account is suspended due to policy violations
     */
    SUSPENDED,
    
    /**
     * User account is pending email verification
     */
    PENDING_VERIFICATION
}