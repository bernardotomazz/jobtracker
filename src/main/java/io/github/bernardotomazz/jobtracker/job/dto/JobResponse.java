package io.github.bernardotomazz.jobtracker.job.dto;

import io.github.bernardotomazz.jobtracker.job.enums.ApplicationStatus;
import io.github.bernardotomazz.jobtracker.job.enums.WorkMode;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class JobResponse {
    private UUID id;
    private String title;
    private String description;
    private ApplicationStatus status;
    private String company;
    private String jobUrl;
    private String location;
    private String salaryRange;
    private WorkMode workMode;
    private String mainRequirements;
    private String desiredRequirements;
    private String processDetails;
    private String notes;
    private LocalDateTime appliedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
