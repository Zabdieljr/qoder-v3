package com.qoderv3.qoder_v3.repository;

import com.qoderv3.qoder_v3.entity.User;
import com.qoderv3.qoder_v3.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for User entity operations.
 * Provides CRUD operations and custom queries for user management.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    /**
     * Find user by username (case-insensitive)
     * @param username the username to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByUsernameIgnoreCase(String username);
    
    /**
     * Find user by email (case-insensitive)
     * @param email the email to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByEmailIgnoreCase(String email);
    
    /**
     * Find user by GitHub username
     * @param githubUsername the GitHub username to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByGithubUsername(String githubUsername);
    
    /**
     * Find user by email verification token
     * @param token the email verification token
     * @return Optional containing the user if found
     */
    Optional<User> findByEmailVerificationToken(String token);
    
    /**
     * Find user by password reset token that hasn't expired
     * @param token the password reset token
     * @param now current timestamp
     * @return Optional containing the user if found
     */
    @Query("SELECT u FROM User u WHERE u.passwordResetToken = :token AND u.passwordResetExpiresAt > :now")
    Optional<User> findByValidPasswordResetToken(@Param("token") String token, @Param("now") OffsetDateTime now);
    
    /**
     * Check if username exists (case-insensitive)
     * @param username the username to check
     * @return true if username exists
     */
    boolean existsByUsernameIgnoreCase(String username);
    
    /**
     * Check if email exists (case-insensitive)
     * @param email the email to check
     * @return true if email exists
     */
    boolean existsByEmailIgnoreCase(String email);
    
    /**
     * Find users by status
     * @param status the user status to filter by
     * @param pageable pagination information
     * @return Page of users with the specified status
     */
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    
    /**
     * Find users by email verification status
     * @param emailVerified whether email is verified
     * @param pageable pagination information
     * @return Page of users with specified email verification status
     */
    Page<User> findByEmailVerified(Boolean emailVerified, Pageable pageable);
    
    /**
     * Find users created after a specific date
     * @param date the date to search after
     * @return List of users created after the date
     */
    List<User> findByCreatedAtAfter(OffsetDateTime date);
    
    /**
     * Find users by partial username or email match (case-insensitive)
     * @param searchTerm the term to search for
     * @param pageable pagination information
     * @return Page of matching users
     */
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<User> searchUsers(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    /**
     * Update user's last login timestamp
     * @param userId the user ID
     * @param lastLoginAt the timestamp to set
     */
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :lastLoginAt WHERE u.id = :userId")
    void updateLastLoginAt(@Param("userId") UUID userId, @Param("lastLoginAt") OffsetDateTime lastLoginAt);
    
    /**
     * Count users by status
     * @param status the user status
     * @return count of users with the status
     */
    long countByStatus(UserStatus status);
    
    /**
     * Count verified users
     * @return count of users with verified emails
     */
    long countByEmailVerifiedTrue();
    
    /**
     * Find users with expired password reset tokens
     * @param now current timestamp
     * @return List of users with expired tokens
     */
    @Query("SELECT u FROM User u WHERE u.passwordResetToken IS NOT NULL AND u.passwordResetExpiresAt < :now")
    List<User> findUsersWithExpiredPasswordResetTokens(@Param("now") OffsetDateTime now);
    
    /**
     * Clean expired password reset tokens
     * @param now current timestamp
     * @return number of records updated
     */
    @Modifying
    @Query("UPDATE User u SET u.passwordResetToken = NULL, u.passwordResetExpiresAt = NULL " +
           "WHERE u.passwordResetToken IS NOT NULL AND u.passwordResetExpiresAt < :now")
    int cleanExpiredPasswordResetTokens(@Param("now") OffsetDateTime now);
    
    /**
     * Find top users by project count
     * @param limit maximum number of users to return
     * @return List of users ordered by project count
     */
    @Query("SELECT u FROM User u LEFT JOIN u.projects p " +
           "GROUP BY u ORDER BY COUNT(p) DESC")
    List<User> findTopUsersByProjectCount(Pageable pageable);
}