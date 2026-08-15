package io.github.bernardotomazz.jobtracker.job.mapper;

import io.github.bernardotomazz.jobtracker.job.dto.CreateJobRequest;
import io.github.bernardotomazz.jobtracker.job.dto.JobResponse;
import io.github.bernardotomazz.jobtracker.job.entity.JobApplication;
import io.github.bernardotomazz.jobtracker.job.enums.ApplicationStatus;
import io.github.bernardotomazz.jobtracker.user.entity.User;

public final class JobApplicationMapper {

    private JobApplicationMapper() {
    }

    public static JobApplication toEntity(CreateJobRequest request, User user) {
        JobApplication jobApplication = new JobApplication();

        jobApplication.setTitle(request.getTitle());
        jobApplication.setDescription(request.getDescription());
        jobApplication.setCompany(request.getCompany());
        jobApplication.setJobUrl(request.getJobUrl());
        jobApplication.setLocation(request.getLocation());
        jobApplication.setSalaryRange(request.getSalaryRange());
        jobApplication.setWorkMode(request.getWorkMode());
        jobApplication.setMainRequirements(request.getMainRequirements());
        jobApplication.setDesiredRequirements(request.getDesiredRequirements());
        jobApplication.setProcessDetails(request.getProcessDetails());
        jobApplication.setNotes(request.getNotes());
        jobApplication.setAppliedAt(request.getAppliedAt());

        jobApplication.setStatus(ApplicationStatus.SAVED);
        jobApplication.setUser(user);

        return jobApplication;
    }

    public static JobResponse toResponse(JobApplication jobApplication) {
        return new JobResponse(
                jobApplication.getId(),
                jobApplication.getTitle(),
                jobApplication.getDescription(),
                jobApplication.getStatus(),
                jobApplication.getCompany(),
                jobApplication.getJobUrl(),
                jobApplication.getLocation(),
                jobApplication.getSalaryRange(),
                jobApplication.getWorkMode(),
                jobApplication.getMainRequirements(),
                jobApplication.getDesiredRequirements(),
                jobApplication.getProcessDetails(),
                jobApplication.getNotes(),
                jobApplication.getAppliedAt(),
                jobApplication.getCreatedAt(),
                jobApplication.getUpdatedAt()
        );
    }

    public static void updateEntity(JobApplication jobApplication, CreateJobRequest request) {
        jobApplication.setTitle(request.getTitle());
        jobApplication.setDescription(request.getDescription());
        jobApplication.setCompany(request.getCompany());
        jobApplication.setJobUrl(request.getJobUrl());
        jobApplication.setLocation(request.getLocation());
        jobApplication.setSalaryRange(request.getSalaryRange());
        jobApplication.setWorkMode(request.getWorkMode());
        jobApplication.setMainRequirements(request.getMainRequirements());
        jobApplication.setDesiredRequirements(request.getDesiredRequirements());
        jobApplication.setProcessDetails(request.getProcessDetails());
        jobApplication.setNotes(request.getNotes());
        jobApplication.setAppliedAt(request.getAppliedAt());
    }
}