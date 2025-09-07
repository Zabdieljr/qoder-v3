package com.qoderv3.qoder_v3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Project entity representing projects in the qoder-v3 application.
 * This entity maps to the 'projects' table in the PostgreSQL database.
 */
@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"owner", "forkParent", "forks"})
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "UUID")
    private UUID id;
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "slug", unique = true, nullable = false, length = 255)
    private String slug;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "detailed_description", columnDefinition = "TEXT")
    private String detailedDescription;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @Column(name = "repository_url", columnDefinition = "TEXT")
    private String repositoryUrl;
    
    @Column(name = "homepage_url", columnDefinition = "TEXT")
    private String homepageUrl;
    
    @Column(name = "documentation_url", columnDefinition = "TEXT")
    private String documentationUrl;
    
    @Column(name = "license", length = 50)
    private String license;
    
    @Column(name = "programming_languages", columnDefinition = "TEXT[]")
    private String[] programmingLanguages;
    
    @Column(name = "tags", columnDefinition = "TEXT[]")
    private String[] tags;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProjectStatus status = ProjectStatus.ACTIVE;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", length = 20)
    private ProjectVisibility visibility = ProjectVisibility.PUBLIC;
    
    @Column(name = "is_template")
    private Boolean isTemplate = false;
    
    @Column(name = "is_fork")
    private Boolean isFork = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fork_parent_id")
    private Project forkParent;
    
    @OneToMany(mappedBy = "forkParent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Project> forks;
    
    @Column(name = "stars_count")
    private Integer starsCount = 0;
    
    @Column(name = "forks_count")
    private Integer forksCount = 0;
    
    @Column(name = "watchers_count")
    private Integer watchersCount = 0;
    
    @Column(name = "issues_count")
    private Integer issuesCount = 0;
    
    @Column(name = "last_activity_at")
    private OffsetDateTime lastActivityAt;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
    
    // Helper methods
    
    /**
     * Checks if the project is active
     * @return true if the project status is ACTIVE
     */
    public boolean isActive() {
        return ProjectStatus.ACTIVE.equals(this.status);
    }
    
    /**
     * Checks if the project is publicly visible
     * @return true if the project visibility is PUBLIC
     */
    public boolean isPublic() {
        return ProjectVisibility.PUBLIC.equals(this.visibility);
    }
    
    /**
     * Checks if the project is private
     * @return true if the project visibility is PRIVATE
     */
    public boolean isPrivate() {
        return ProjectVisibility.PRIVATE.equals(this.visibility);
    }
    
    /**
     * Checks if the project can be used as a template
     * @return true if isTemplate is true
     */
    public boolean isTemplate() {
        return Boolean.TRUE.equals(this.isTemplate);
    }
    
    /**
     * Checks if the project is a fork of another project
     * @return true if isFork is true and forkParent exists
     */
    public boolean isFork() {
        return Boolean.TRUE.equals(this.isFork) && this.forkParent != null;
    }
    
    /**
     * Updates the last activity timestamp to now
     */
    public void updateLastActivity() {
        this.lastActivityAt = OffsetDateTime.now();
    }
    
    /**
     * Increments the stars count
     */
    public void incrementStars() {
        this.starsCount = (this.starsCount == null ? 0 : this.starsCount) + 1;
        updateLastActivity();
    }
    
    /**
     * Decrements the stars count (minimum 0)
     */
    public void decrementStars() {
        this.starsCount = Math.max(0, (this.starsCount == null ? 0 : this.starsCount) - 1);
        updateLastActivity();
    }
    
    /**
     * Increments the forks count
     */
    public void incrementForks() {
        this.forksCount = (this.forksCount == null ? 0 : this.forksCount) + 1;
        updateLastActivity();
    }
    
    /**
     * Gets the full project identifier in the format "owner/slug"
     * @return formatted project identifier
     */
    public String getFullName() {
        return (owner != null ? owner.getUsername() : "unknown") + "/" + slug;
    }
}