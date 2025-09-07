package com.qoderv3.qoder_v3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * User entity representing user accounts in the qoder-v3 application.
 * This entity maps to the 'users' table in the PostgreSQL database.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"projects", "passwordHash", "passwordResetToken", "emailVerificationToken"})
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "UUID")
    private UUID id;
    
    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(name = "email", unique = true, nullable = false, length = 255)
    private String email;
    
    @Column(name = "password_hash")
    private String passwordHash;
    
    @Column(name = "first_name", length = 100)
    private String firstName;
    
    @Column(name = "last_name", length = 100)
    private String lastName;
    
    @Column(name = "full_name", length = 255)
    private String fullName;
    
    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;
    
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;
    
    @Column(name = "github_username", length = 50)
    private String githubUsername;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus status = UserStatus.ACTIVE;
    
    @Column(name = "email_verified")
    private Boolean emailVerified = false;
    
    @Column(name = "email_verification_token")
    private String emailVerificationToken;
    
    @Column(name = "password_reset_token")
    private String passwordResetToken;
    
    @Column(name = "password_reset_expires_at")
    private OffsetDateTime passwordResetExpiresAt;
    
    @Column(name = "last_login_at")
    private OffsetDateTime lastLoginAt;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Project> projects = new ArrayList<>();
    
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Project> ownedProjects = new ArrayList<>();
    
    // Helper methods
    
    /**
     * Checks if the user account is active
     * @return true if the user status is ACTIVE
     */
    public boolean isActive() {
        return UserStatus.ACTIVE.equals(this.status);
    }
    
    /**
     * Checks if the user's email is verified
     * @return true if email is verified
     */
    public boolean isEmailVerified() {
        return Boolean.TRUE.equals(this.emailVerified);
    }
    
    /**
     * Gets the display name for the user
     * @return full name if available, otherwise username
     */
    public String getDisplayName() {
        return fullName != null && !fullName.trim().isEmpty() ? fullName : username;
    }
    
    /**
     * Checks if the user has a password reset token that hasn't expired
     * @return true if token exists and hasn't expired
     */
    public boolean hasValidPasswordResetToken() {
        return passwordResetToken != null && 
               passwordResetExpiresAt != null && 
               passwordResetExpiresAt.isAfter(OffsetDateTime.now());
    }
    
    /**
     * Clears the password reset token and expiration
     */
    public void clearPasswordResetToken() {
        this.passwordResetToken = null;
        this.passwordResetExpiresAt = null;
    }
    
    /**
     * Marks the email as verified and clears the verification token
     */
    public void verifyEmail() {
        this.emailVerified = true;
        this.emailVerificationToken = null;
    }
}