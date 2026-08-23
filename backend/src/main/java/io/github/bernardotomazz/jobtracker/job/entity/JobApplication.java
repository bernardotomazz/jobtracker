package io.github.bernardotomazz.jobtracker.job.entity;

import io.github.bernardotomazz.jobtracker.job.enums.ApplicationStatus;
import io.github.bernardotomazz.jobtracker.job.enums.WorkMode;
import io.github.bernardotomazz.jobtracker.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "job_applications")
@Entity
public class JobApplication {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;
    @Column(nullable = false)
    private String company;
    private String jobUrl;
    private String location;
    private String salaryRange;
    @Enumerated(EnumType.STRING)
    private WorkMode workMode;
    private String mainRequirements;
    private String desiredRequirements;
    private String processDetails;
    private String notes;
    private LocalDateTime appliedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
