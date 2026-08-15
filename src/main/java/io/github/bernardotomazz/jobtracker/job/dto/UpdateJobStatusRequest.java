package io.github.bernardotomazz.jobtracker.job.dto;

import io.github.bernardotomazz.jobtracker.job.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateJobStatusRequest {
    @NotNull
    private ApplicationStatus status;
}
