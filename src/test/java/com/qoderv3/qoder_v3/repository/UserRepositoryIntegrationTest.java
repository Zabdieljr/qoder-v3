package com.qoderv3.qoder_v3.repository;

import com.qoderv3.qoder_v3.entity.User;
import com.qoderv3.qoder_v3.entity.UserStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for UserRepository to verify JPA entity mappings and repository operations.
 * These tests use an in-memory H2 database for testing purposes.
 */
@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryIntegrationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void whenSaveUser_thenCanFindByUsername() {
        // Given
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setFullName("Test User");
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(true);

        // When
        User savedUser = userRepository.save(user);
        entityManager.flush();

        // Then
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getCreatedAt()).isNotNull();
        assertThat(savedUser.getUpdatedAt()).isNotNull();

        Optional<User> foundUser = userRepository.findByUsernameIgnoreCase("testuser");
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo("test@example.com");
        assertThat(foundUser.get().getDisplayName()).isEqualTo("Test User");
        assertThat(foundUser.get().isActive()).isTrue();
        assertThat(foundUser.get().isEmailVerified()).isTrue();
    }

    @Test
    void whenSaveUser_thenCanFindByEmail() {
        // Given
        User user = new User();
        user.setUsername("emailtest");
        user.setEmail("EMAIL@EXAMPLE.COM");
        user.setStatus(UserStatus.PENDING_VERIFICATION);
        user.setEmailVerified(false);

        // When
        userRepository.save(user);
        entityManager.flush();

        // Then
        Optional<User> foundUser = userRepository.findByEmailIgnoreCase("email@example.com");
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUsername()).isEqualTo("emailtest");
        assertThat(foundUser.get().getStatus()).isEqualTo(UserStatus.PENDING_VERIFICATION);
        assertThat(foundUser.get().isActive()).isFalse();
        assertThat(foundUser.get().isEmailVerified()).isFalse();
    }

    @Test
    void whenCheckUsernameExists_thenReturnCorrectResult() {
        // Given
        User user = new User();
        user.setUsername("existinguser");
        user.setEmail("existing@example.com");
        userRepository.save(user);
        entityManager.flush();

        // When & Then
        assertThat(userRepository.existsByUsernameIgnoreCase("existinguser")).isTrue();
        assertThat(userRepository.existsByUsernameIgnoreCase("EXISTINGUSER")).isTrue();
        assertThat(userRepository.existsByUsernameIgnoreCase("nonexistentuser")).isFalse();
    }

    @Test
    void whenSaveUserWithoutFullName_thenDisplayNameIsUsername() {
        // Given
        User user = new User();
        user.setUsername("noname");
        user.setEmail("noname@example.com");
        user.setFullName(null);

        // When
        User savedUser = userRepository.save(user);

        // Then
        assertThat(savedUser.getDisplayName()).isEqualTo("noname");
    }

    @Test
    void whenSaveUserWithEmptyFullName_thenDisplayNameIsUsername() {
        // Given
        User user = new User();
        user.setUsername("emptyname");
        user.setEmail("empty@example.com");
        user.setFullName("   ");

        // When
        User savedUser = userRepository.save(user);

        // Then
        assertThat(savedUser.getDisplayName()).isEqualTo("emptyname");
    }

    @Test
    void whenCountByStatus_thenReturnCorrectCount() {
        // Given
        User activeUser1 = createUser("active1", "active1@example.com", UserStatus.ACTIVE);
        User activeUser2 = createUser("active2", "active2@example.com", UserStatus.ACTIVE);
        User inactiveUser = createUser("inactive", "inactive@example.com", UserStatus.INACTIVE);
        
        userRepository.save(activeUser1);
        userRepository.save(activeUser2);
        userRepository.save(inactiveUser);
        entityManager.flush();

        // When & Then
        assertThat(userRepository.countByStatus(UserStatus.ACTIVE)).isEqualTo(2);
        assertThat(userRepository.countByStatus(UserStatus.INACTIVE)).isEqualTo(1);
        assertThat(userRepository.countByStatus(UserStatus.SUSPENDED)).isEqualTo(0);
    }

    @Test
    void whenCountVerifiedUsers_thenReturnCorrectCount() {
        // Given
        User verifiedUser1 = createUser("verified1", "verified1@example.com", UserStatus.ACTIVE);
        verifiedUser1.setEmailVerified(true);
        
        User verifiedUser2 = createUser("verified2", "verified2@example.com", UserStatus.ACTIVE);
        verifiedUser2.setEmailVerified(true);
        
        User unverifiedUser = createUser("unverified", "unverified@example.com", UserStatus.PENDING_VERIFICATION);
        unverifiedUser.setEmailVerified(false);
        
        userRepository.save(verifiedUser1);
        userRepository.save(verifiedUser2);
        userRepository.save(unverifiedUser);
        entityManager.flush();

        // When & Then
        assertThat(userRepository.countByEmailVerifiedTrue()).isEqualTo(2);
    }

    private User createUser(String username, String email, UserStatus status) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setStatus(status);
        return user;
    }
}