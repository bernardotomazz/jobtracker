package io.github.bernardotomazz.jobtracker.job.dto;

import io.github.bernardotomazz.jobtracker.job.enums.WorkMode;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CreateJobRequest {
    @NotBlank
    private String title;
    private String description;
    @NotBlank
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
}
