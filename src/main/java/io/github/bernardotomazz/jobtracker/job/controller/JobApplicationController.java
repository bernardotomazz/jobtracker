package io.github.bernardotomazz.jobtracker.job.controller;

import io.github.bernardotomazz.jobtracker.job.dto.CreateJobRequest;
import io.github.bernardotomazz.jobtracker.job.dto.JobResponse;
import io.github.bernardotomazz.jobtracker.job.dto.UpdateJobStatusRequest;
import io.github.bernardotomazz.jobtracker.job.enums.ApplicationStatus;
import io.github.bernardotomazz.jobtracker.job.enums.WorkMode;
import io.github.bernardotomazz.jobtracker.job.service.JobApplicationService;
import io.github.bernardotomazz.jobtracker.user.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/jobs")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobResponse createJob(@RequestBody @Valid CreateJobRequest jobRequest, @AuthenticationPrincipal User user) {
        return jobApplicationService.createJobApplication(jobRequest, user);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<JobResponse> getAllJobs(@RequestParam(required = false) ApplicationStatus status,
                                        @RequestParam(required = false) WorkMode workMode,
                                        @RequestParam(required = false) String company,
                                        @RequestParam(required = false) String search,
                                        @AuthenticationPrincipal User user) {
        return jobApplicationService.getAllJobApplications(status, workMode, company, search, user);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public JobResponse getJobById(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        return jobApplicationService.getJobApplicationById(id, user);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public JobResponse updateJobById(@PathVariable UUID id, @RequestBody @Valid CreateJobRequest jobRequest, @AuthenticationPrincipal User user) {
        return jobApplicationService.updateJobApplication(id, jobRequest, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteJobById(@PathVariable UUID id,@AuthenticationPrincipal User user) {
        jobApplicationService.deleteJobApplicationById(id, user);
    }

    @PatchMapping("/{id}/status")
    @ResponseStatus(HttpStatus.OK)
    public JobResponse updateJobStatus(@PathVariable UUID id, @RequestBody @Valid UpdateJobStatusRequest jobStatusRequest, @AuthenticationPrincipal User user) {
        return jobApplicationService.updateJobApplicationStatus(id, jobStatusRequest, user);
    }
}
