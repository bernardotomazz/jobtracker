package io.github.bernardotomazz.jobtracker.job.service;

import io.github.bernardotomazz.jobtracker.job.dto.CreateJobRequest;
import io.github.bernardotomazz.jobtracker.job.dto.JobResponse;
import io.github.bernardotomazz.jobtracker.job.dto.UpdateJobStatusRequest;
import io.github.bernardotomazz.jobtracker.job.entity.JobApplication;
import io.github.bernardotomazz.jobtracker.job.enums.ApplicationStatus;
import io.github.bernardotomazz.jobtracker.job.mapper.JobApplicationMapper;
import io.github.bernardotomazz.jobtracker.job.repository.JobApplicationRepository;
import io.github.bernardotomazz.jobtracker.user.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;


@Service
public class JobApplicationService {
    private final JobApplicationRepository jobApplicationRepository;
    public JobApplicationService(JobApplicationRepository jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }

    public JobResponse createJobApplication(CreateJobRequest jobRequest, User user) {
        JobApplication jobApplication = JobApplicationMapper.toEntity(jobRequest, user);
        JobApplication job = jobApplicationRepository.save(jobApplication);
        return JobApplicationMapper.toResponse(job);
    }

    public List<JobResponse> getAllJobApplications(User user) {
        return jobApplicationRepository.findByUserIdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(JobApplicationMapper::toResponse)
                .toList();
    }

    public JobResponse getJobApplicationById(UUID id, User user) {
        return JobApplicationMapper.toResponse(findJobApplication(id, user));

    }

    public JobResponse updateJobApplication(UUID id, CreateJobRequest jobRequest, User user) {
        JobApplication jobApplication = findJobApplication(id, user);
        JobApplicationMapper.updateEntity(jobApplication, jobRequest);
        JobApplication saved = jobApplicationRepository.save(jobApplication);
        return JobApplicationMapper.toResponse(saved);
    }

    public void deleteJobApplicationById(UUID id, User user) {
       jobApplicationRepository.delete(findJobApplication(id, user));
    }

    public JobResponse updateJobApplicationStatus(UUID id, UpdateJobStatusRequest jobStatusRequest, User user) {
        JobApplication jobApplication = findJobApplication(id, user);
        jobApplication.setStatus(jobStatusRequest.getStatus());
        JobApplication saved = jobApplicationRepository.save(jobApplication);
        return JobApplicationMapper.toResponse(saved);
    }

    //Métodos privados
    private JobApplication findJobApplication(UUID id, User user) {
        return jobApplicationRepository.findByIdAndUserId(id, user.getId()).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
    }
}
