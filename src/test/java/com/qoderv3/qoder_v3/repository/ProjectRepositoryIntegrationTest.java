package com.qoderv3.qoder_v3.repository;

import com.qoderv3.qoder_v3.entity.Project;
import com.qoderv3.qoder_v3.entity.ProjectStatus;
import com.qoderv3.qoder_v3.entity.ProjectVisibility;
import com.qoderv3.qoder_v3.entity.User;
import com.qoderv3.qoder_v3.entity.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for ProjectRepository to verify JPA entity mappings and repository operations.
 */
@DataJpaTest
@ActiveProfiles("test")
class ProjectRepositoryIntegrationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUsername("projectowner");
        testUser.setEmail("owner@example.com");
        testUser.setStatus(UserStatus.ACTIVE);
        testUser = userRepository.save(testUser);
        entityManager.flush();
    }

    @Test
    void whenSaveProject_thenCanFindBySlug() {
        // Given
        Project project = new Project();
        project.setName("Test Project");
        project.setSlug("test-project");
        project.setDescription("A test project for integration testing");
        project.setOwner(testUser);
        project.setStatus(ProjectStatus.ACTIVE);
        project.setVisibility(ProjectVisibility.PUBLIC);
        project.setProgrammingLanguages(new String[]{"Java", "JavaScript"});
        project.setTags(new String[]{"test", "demo", "spring"});

        // When
        Project savedProject = projectRepository.save(project);
        entityManager.flush();

        // Then
        assertThat(savedProject.getId()).isNotNull();
        assertThat(savedProject.getCreatedAt()).isNotNull();
        assertThat(savedProject.getUpdatedAt()).isNotNull();
        assertThat(savedProject.getLastActivityAt()).isNull(); // Not set by default

        Optional<Project> foundProject = projectRepository.findBySlug("test-project");
        assertThat(foundProject).isPresent();
        assertThat(foundProject.get().getName()).isEqualTo("Test Project");
        assertThat(foundProject.get().getOwner().getUsername()).isEqualTo("projectowner");
        assertThat(foundProject.get().isActive()).isTrue();
        assertThat(foundProject.get().isPublic()).isTrue();
        assertThat(foundProject.get().isPrivate()).isFalse();
    }

    @Test
    void whenSaveProject_thenCanFindByOwnerAndSlug() {
        // Given
        Project project = new Project();
        project.setName("Owner Project");
        project.setSlug("owner-project");
        project.setOwner(testUser);
        project.setStatus(ProjectStatus.ACTIVE);

        // When
        projectRepository.save(project);
        entityManager.flush();

        // Then
        Optional<Project> foundProject = projectRepository.findByOwnerAndSlug(testUser, "owner-project");
        assertThat(foundProject).isPresent();
        assertThat(foundProject.get().getName()).isEqualTo("Owner Project");
    }

    @Test
    void whenSaveProject_thenCanFindByOwnerUsernameAndSlug() {
        // Given
        Project project = new Project();
        project.setName("Username Project");
        project.setSlug("username-project");
        project.setOwner(testUser);

        // When
        projectRepository.save(project);
        entityManager.flush();

        // Then
        Optional<Project> foundProject = projectRepository.findByOwnerUsernameAndSlug("projectowner", "username-project");
        assertThat(foundProject).isPresent();
        assertThat(foundProject.get().getName()).isEqualTo("Username Project");
    }

    @Test
    void whenCheckSlugExists_thenReturnCorrectResult() {
        // Given
        Project project = new Project();
        project.setName("Existing Project");
        project.setSlug("existing-project");
        project.setOwner(testUser);
        projectRepository.save(project);
        entityManager.flush();

        // When & Then
        assertThat(projectRepository.existsBySlug("existing-project")).isTrue();
        assertThat(projectRepository.existsBySlug("non-existing-project")).isFalse();
    }

    @Test
    void whenCreateTemplate_thenCanFindTemplates() {
        // Given
        Project template = new Project();
        template.setName("Template Project");
        template.setSlug("template-project");
        template.setOwner(testUser);
        template.setIsTemplate(true);
        template.setVisibility(ProjectVisibility.PUBLIC);

        Project normalProject = new Project();
        normalProject.setName("Normal Project");
        normalProject.setSlug("normal-project");
        normalProject.setOwner(testUser);
        normalProject.setIsTemplate(false);

        // When
        projectRepository.save(template);
        projectRepository.save(normalProject);
        entityManager.flush();

        // Then
        var templates = projectRepository.findByIsTemplateTrue(null);
        assertThat(templates).hasSize(1);
        assertThat(templates.getContent().get(0).getName()).isEqualTo("Template Project");
        assertThat(templates.getContent().get(0).isTemplate()).isTrue();
    }

    @Test
    void whenCreateFork_thenCanFindForksAndParent() {
        // Given
        Project parentProject = new Project();
        parentProject.setName("Parent Project");
        parentProject.setSlug("parent-project");
        parentProject.setOwner(testUser);
        parentProject.setForksCount(0);
        parentProject = projectRepository.save(parentProject);

        Project forkProject = new Project();
        forkProject.setName("Fork Project");
        forkProject.setSlug("fork-project");
        forkProject.setOwner(testUser);
        forkProject.setIsFork(true);
        forkProject.setForkParent(parentProject);

        // When
        projectRepository.save(forkProject);
        entityManager.flush();

        // Then
        var forks = projectRepository.findByForkParent(parentProject, null);
        assertThat(forks).hasSize(1);
        assertThat(forks.getContent().get(0).getName()).isEqualTo("Fork Project");
        assertThat(forks.getContent().get(0).isFork()).isTrue();
        assertThat(forks.getContent().get(0).getForkParent().getName()).isEqualTo("Parent Project");
    }

    @Test
    void whenCountProjectsByOwner_thenReturnCorrectCount() {
        // Given
        Project project1 = createProject("Project 1", "project-1", testUser);
        Project project2 = createProject("Project 2", "project-2", testUser);
        
        projectRepository.save(project1);
        projectRepository.save(project2);
        entityManager.flush();

        // When & Then
        assertThat(projectRepository.countByOwner(testUser)).isEqualTo(2);
    }

    @Test
    void whenCountProjectsByStatus_thenReturnCorrectCount() {
        // Given
        Project activeProject = createProject("Active", "active", testUser);
        activeProject.setStatus(ProjectStatus.ACTIVE);
        
        Project inactiveProject = createProject("Inactive", "inactive", testUser);
        inactiveProject.setStatus(ProjectStatus.INACTIVE);
        
        projectRepository.save(activeProject);
        projectRepository.save(inactiveProject);
        entityManager.flush();

        // When & Then
        assertThat(projectRepository.countByStatus(ProjectStatus.ACTIVE)).isEqualTo(1);
        assertThat(projectRepository.countByStatus(ProjectStatus.INACTIVE)).isEqualTo(1);
        assertThat(projectRepository.countByStatus(ProjectStatus.ARCHIVED)).isEqualTo(0);
    }

    @Test
    void whenProjectHasStars_thenStarCountMethodsWork() {
        // Given
        Project project = createProject("Starred Project", "starred", testUser);
        project.setStarsCount(5);
        project = projectRepository.save(project);
        entityManager.flush();

        // When
        project.incrementStars();
        project.incrementStars();

        // Then
        assertThat(project.getStarsCount()).isEqualTo(7);

        // When
        project.decrementStars();

        // Then
        assertThat(project.getStarsCount()).isEqualTo(6);

        // When - test that decrement doesn't go below 0
        project.setStarsCount(0);
        project.decrementStars();

        // Then
        assertThat(project.getStarsCount()).isEqualTo(0);
    }

    @Test
    void whenProjectHasFullName_thenFormatCorrectly() {
        // Given
        Project project = createProject("Full Name Test", "full-name-test", testUser);
        project = projectRepository.save(project);

        // When & Then
        assertThat(project.getFullName()).isEqualTo("projectowner/full-name-test");
    }

    private Project createProject(String name, String slug, User owner) {
        Project project = new Project();
        project.setName(name);
        project.setSlug(slug);
        project.setOwner(owner);
        project.setStatus(ProjectStatus.ACTIVE);
        project.setVisibility(ProjectVisibility.PUBLIC);
        return project;
    }
}