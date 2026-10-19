package io.github.bernardotomazz.jobtracker.email.repository;

import io.github.bernardotomazz.jobtracker.email.entity.PasswordResetToken;
import io.github.bernardotomazz.jobtracker.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;


public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUser(User user);
}
