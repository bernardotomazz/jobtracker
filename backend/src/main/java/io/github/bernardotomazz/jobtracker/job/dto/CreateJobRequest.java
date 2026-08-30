package io.github.bernardotomazz.jobtracker.job.dto;

import io.github.bernardotomazz.jobtracker.job.enums.WorkMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CreateJobRequest {
    @NotBlank
    @Size(max = 100)
    private String title;
    @Size(max = 5000)
    private String description;
    @NotBlank
    @Size(max = 100)
    private String company;
    @Size(max = 500)
    private String jobUrl;
    @Size(max = 100)
    private String location;
    @Size(max = 100)
    private String salaryRange;
    private WorkMode workMode;
    @Size(max = 5000)
    private String mainRequirements;
    @Size(max = 5000)
    private String desiredRequirements;
    @Size(max = 5000)
    private String processDetails;
    @Size(max = 5000)
    private String notes;
    private LocalDateTime appliedAt;
}
