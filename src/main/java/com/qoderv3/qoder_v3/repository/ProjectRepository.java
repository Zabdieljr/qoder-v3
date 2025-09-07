package com.qoderv3.qoder_v3.repository;

import com.qoderv3.qoder_v3.entity.Project;
import com.qoderv3.qoder_v3.entity.ProjectStatus;
import com.qoderv3.qoder_v3.entity.ProjectVisibility;
import com.qoderv3.qoder_v3.entity.User;
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
 * Repository interface for Project entity operations.
 * Provides CRUD operations and custom queries for project management.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    
    /**
     * Find project by slug
     * @param slug the project slug
     * @return Optional containing the project if found
     */
    Optional<Project> findBySlug(String slug);
    
    /**
     * Find project by owner and slug
     * @param owner the project owner
     * @param slug the project slug
     * @return Optional containing the project if found
     */
    Optional<Project> findByOwnerAndSlug(User owner, String slug);
    
    /**
     * Find project by owner username and slug
     * @param username the owner's username
     * @param slug the project slug
     * @return Optional containing the project if found
     */
    @Query("SELECT p FROM Project p JOIN p.owner u WHERE u.username = :username AND p.slug = :slug")
    Optional<Project> findByOwnerUsernameAndSlug(@Param("username") String username, @Param("slug") String slug);
    
    /**
     * Check if slug exists
     * @param slug the slug to check
     * @return true if slug exists
     */
    boolean existsBySlug(String slug);
    
    /**
     * Find projects by owner
     * @param owner the project owner
     * @param pageable pagination information
     * @return Page of projects owned by the user
     */
    Page<Project> findByOwner(User owner, Pageable pageable);
    
    /**
     * Find projects by owner and status
     * @param owner the project owner
     * @param status the project status
     * @param pageable pagination information
     * @return Page of projects with specified owner and status
     */
    Page<Project> findByOwnerAndStatus(User owner, ProjectStatus status, Pageable pageable);
    
    /**
     * Find projects by status
     * @param status the project status
     * @param pageable pagination information
     * @return Page of projects with the specified status
     */
    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);
    
    /**
     * Find projects by visibility
     * @param visibility the project visibility
     * @param pageable pagination information
     * @return Page of projects with the specified visibility
     */
    Page<Project> findByVisibility(ProjectVisibility visibility, Pageable pageable);
    
    /**
     * Find public projects by status
     * @param status the project status
     * @param pageable pagination information
     * @return Page of public projects with the specified status
     */
    Page<Project> findByVisibilityAndStatus(ProjectVisibility visibility, ProjectStatus status, Pageable pageable);
    
    /**
     * Find template projects
     * @param pageable pagination information
     * @return Page of template projects
     */
    Page<Project> findByIsTemplateTrue(Pageable pageable);
    
    /**
     * Find fork projects
     * @param pageable pagination information
     * @return Page of fork projects
     */
    Page<Project> findByIsForkTrue(Pageable pageable);
    
    /**
     * Find projects by fork parent
     * @param forkParent the parent project
     * @param pageable pagination information
     * @return Page of projects that are forks of the parent
     */
    Page<Project> findByForkParent(Project forkParent, Pageable pageable);
    
    /**
     * Find projects containing programming language
     * @param language the programming language to search for
     * @param pageable pagination information
     * @return Page of projects using the specified language
     */
    @Query(value = "SELECT * FROM projects p WHERE :language = ANY(p.programming_languages)", nativeQuery = true)
    Page<Project> findByProgrammingLanguage(@Param("language") String language, Pageable pageable);
    
    /**
     * Find projects containing any of the specified tags
     * @param tags the tags to search for
     * @param pageable pagination information
     * @return Page of projects with any of the specified tags
     */
    @Query(value = "SELECT * FROM projects p WHERE p.tags && CAST(:tags AS text[])", nativeQuery = true)
    Page<Project> findByTagsIn(@Param("tags") String[] tags, Pageable pageable);
    
    /**
     * Search projects by name, description, or tags (full-text search)
     * @param searchTerm the term to search for
     * @param pageable pagination information
     * @return Page of matching projects
     */
    @Query(value = "SELECT * FROM projects p WHERE " +
           "to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '') || ' ' || " +
           "COALESCE(array_to_string(p.tags, ' '), '')) @@ plainto_tsquery('english', :searchTerm)", nativeQuery = true)
    Page<Project> searchProjects(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    /**
     * Find projects with most stars
     * @param pageable pagination information
     * @return Page of projects ordered by stars count descending
     */
    @Query("SELECT p FROM Project p WHERE p.visibility = 'PUBLIC' AND p.status = 'ACTIVE' " +
           "ORDER BY p.starsCount DESC, p.createdAt DESC")
    Page<Project> findMostStarredProjects(Pageable pageable);
    
    /**
     * Find recently active projects
     * @param since the date to search from
     * @param pageable pagination information
     * @return Page of projects with recent activity
     */
    @Query("SELECT p FROM Project p WHERE p.visibility = 'PUBLIC' AND p.status = 'ACTIVE' " +
           "AND p.lastActivityAt >= :since ORDER BY p.lastActivityAt DESC")
    Page<Project> findRecentlyActiveProjects(@Param("since") OffsetDateTime since, Pageable pageable);
    
    /**
     * Find trending projects (most stars in a time period)
     * @param since the date to search from
     * @param pageable pagination information
     * @return Page of trending projects
     */
    @Query("SELECT p FROM Project p WHERE p.visibility = 'PUBLIC' AND p.status = 'ACTIVE' " +
           "AND p.createdAt >= :since ORDER BY p.starsCount DESC, p.forksCount DESC")
    Page<Project> findTrendingProjects(@Param("since") OffsetDateTime since, Pageable pageable);
    
    /**
     * Update project's last activity timestamp
     * @param projectId the project ID
     * @param lastActivityAt the timestamp to set
     */
    @Modifying
    @Query("UPDATE Project p SET p.lastActivityAt = :lastActivityAt WHERE p.id = :projectId")
    void updateLastActivityAt(@Param("projectId") UUID projectId, @Param("lastActivityAt") OffsetDateTime lastActivityAt);
    
    /**
     * Increment project stars count
     * @param projectId the project ID
     */
    @Modifying
    @Query("UPDATE Project p SET p.starsCount = COALESCE(p.starsCount, 0) + 1, p.lastActivityAt = :now WHERE p.id = :projectId")
    void incrementStarsCount(@Param("projectId") UUID projectId, @Param("now") OffsetDateTime now);
    
    /**
     * Decrement project stars count (minimum 0)
     * @param projectId the project ID
     */
    @Modifying
    @Query("UPDATE Project p SET p.starsCount = GREATEST(COALESCE(p.starsCount, 0) - 1, 0), p.lastActivityAt = :now WHERE p.id = :projectId")
    void decrementStarsCount(@Param("projectId") UUID projectId, @Param("now") OffsetDateTime now);
    
    /**
     * Increment project forks count
     * @param projectId the project ID
     */
    @Modifying
    @Query("UPDATE Project p SET p.forksCount = COALESCE(p.forksCount, 0) + 1, p.lastActivityAt = :now WHERE p.id = :projectId")
    void incrementForksCount(@Param("projectId") UUID projectId, @Param("now") OffsetDateTime now);
    
    /**
     * Count projects by owner
     * @param owner the project owner
     * @return count of projects owned by the user
     */
    long countByOwner(User owner);
    
    /**
     * Count projects by status
     * @param status the project status
     * @return count of projects with the status
     */
    long countByStatus(ProjectStatus status);
    
    /**
     * Count public projects
     * @return count of public projects
     */
    long countByVisibility(ProjectVisibility visibility);
    
    /**
     * Get total stars count across all projects
     * @return sum of all stars
     */
    @Query("SELECT COALESCE(SUM(p.starsCount), 0) FROM Project p")
    Long getTotalStarsCount();
    
    /**
     * Find projects that need activity update (older than specified time)
     * @param olderThan timestamp threshold
     * @param pageable pagination information
     * @return Page of projects needing activity update
     */
    @Query("SELECT p FROM Project p WHERE p.status = 'ACTIVE' AND " +
           "(p.lastActivityAt IS NULL OR p.lastActivityAt < :olderThan)")
    Page<Project> findProjectsNeedingActivityUpdate(@Param("olderThan") OffsetDateTime olderThan, Pageable pageable);
}