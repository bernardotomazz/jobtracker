package io.github.bernardotomazz.jobtracker.job.repository;

import io.github.bernardotomazz.jobtracker.job.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID>, JpaSpecificationExecutor<JobApplication> {
    List<JobApplication> findByUserIdOrderByUpdatedAtDesc(UUID userId);
    Optional<JobApplication> findByIdAndUserId(UUID id, UUID userId);
}
