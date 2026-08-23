package io.github.bernardotomazz.jobtracker.job.service;

import io.github.bernardotomazz.jobtracker.common.exception.ResourceNotFoundException;
import io.github.bernardotomazz.jobtracker.job.dto.CreateJobRequest;
import io.github.bernardotomazz.jobtracker.job.dto.JobResponse;
import io.github.bernardotomazz.jobtracker.job.dto.UpdateJobStatusRequest;
import io.github.bernardotomazz.jobtracker.job.entity.JobApplication;
import io.github.bernardotomazz.jobtracker.job.enums.ApplicationStatus;
import io.github.bernardotomazz.jobtracker.job.enums.WorkMode;
import io.github.bernardotomazz.jobtracker.job.repository.JobApplicationRepository;
import io.github.bernardotomazz.jobtracker.user.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @InjectMocks
    private JobApplicationService jobApplicationService;

    @Test
    void shouldCreateJobWithSavedStatusAndAuthenticatedOwner() {
        User user = createUser();
        CreateJobRequest request = createRequest();
        UUID jobId = UUID.randomUUID();

        when(jobApplicationRepository.save(any(JobApplication.class)))
                .thenAnswer(invocation -> {
                    JobApplication job = invocation.getArgument(0);
                    job.setId(jobId);
                    return job;
                });

        JobResponse response =
                jobApplicationService.createJobApplication(request, user);

        ArgumentCaptor<JobApplication> captor =
                ArgumentCaptor.forClass(JobApplication.class);

        verify(jobApplicationRepository).save(captor.capture());

        JobApplication savedJob = captor.getValue();

        assertEquals(jobId, response.getId());
        assertEquals(request.getTitle(), savedJob.getTitle());
        assertEquals(request.getCompany(), savedJob.getCompany());
        assertEquals(ApplicationStatus.SAVED, savedJob.getStatus());
        assertSame(user, savedJob.getUser());
    }

    @Test
    void shouldListJobsUsingSpecificationAndSort() {
        User user = createUser();

        JobApplication firstJob =
                createJob(user, "Primeira vaga", ApplicationStatus.SAVED);

        JobApplication secondJob =
                createJob(user, "Segunda vaga", ApplicationStatus.APPLIED);

        when(jobApplicationRepository.findAll(
                any(Specification.class),
                any(Sort.class)
        )).thenReturn(List.of(firstJob, secondJob));

        List<JobResponse> responses =
                jobApplicationService.getAllJobApplications(
                        ApplicationStatus.APPLIED,
                        WorkMode.REMOTE,
                        "Tech",
                        "Java",
                        user
                );

        assertEquals(2, responses.size());
        assertEquals("Primeira vaga", responses.get(0).getTitle());
        assertEquals("Segunda vaga", responses.get(1).getTitle());

        verify(jobApplicationRepository).findAll(
                any(Specification.class),
                any(Sort.class)
        );
    }

    @Test
    void shouldGetJobWhenItBelongsToAuthenticatedUser() {
        User user = createUser();
        UUID jobId = UUID.randomUUID();

        JobApplication job =
                createJob(user, "Desenvolvedor Java", ApplicationStatus.SAVED);

        job.setId(jobId);

        when(jobApplicationRepository.findByIdAndUserId(jobId, user.getId()))
                .thenReturn(Optional.of(job));

        JobResponse response =
                jobApplicationService.getJobApplicationById(jobId, user);

        assertEquals(jobId, response.getId());
        assertEquals("Desenvolvedor Java", response.getTitle());

        verify(jobApplicationRepository)
                .findByIdAndUserId(jobId, user.getId());
    }

    @Test
    void shouldThrowExceptionWhenJobIsNotFound() {
        User user = createUser();
        UUID jobId = UUID.randomUUID();

        when(jobApplicationRepository.findByIdAndUserId(jobId, user.getId()))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> jobApplicationService.getJobApplicationById(jobId, user)
        );
    }

    @Test
    void shouldUpdateExistingJobWithoutChangingOwnerOrStatus() {
        User user = createUser();
        UUID jobId = UUID.randomUUID();

        JobApplication existingJob =
                createJob(user, "Título antigo", ApplicationStatus.APPLIED);

        existingJob.setId(jobId);

        CreateJobRequest request = createRequest();
        request.setTitle("Título atualizado");
        request.setCompany("Empresa atualizada");

        when(jobApplicationRepository.findByIdAndUserId(jobId, user.getId()))
                .thenReturn(Optional.of(existingJob));

        when(jobApplicationRepository.save(existingJob))
                .thenReturn(existingJob);

        JobResponse response =
                jobApplicationService.updateJobApplication(
                        jobId,
                        request,
                        user
                );

        assertEquals(jobId, response.getId());
        assertEquals("Título atualizado", existingJob.getTitle());
        assertEquals("Empresa atualizada", existingJob.getCompany());
        assertEquals(ApplicationStatus.APPLIED, existingJob.getStatus());
        assertSame(user, existingJob.getUser());

        verify(jobApplicationRepository).save(existingJob);
    }

    @Test
    void shouldDeleteJobOwnedByAuthenticatedUser() {
        User user = createUser();
        UUID jobId = UUID.randomUUID();

        JobApplication job =
                createJob(user, "Vaga para excluir", ApplicationStatus.FINISHED);

        job.setId(jobId);

        when(jobApplicationRepository.findByIdAndUserId(jobId, user.getId()))
                .thenReturn(Optional.of(job));

        jobApplicationService.deleteJobApplicationById(jobId, user);

        verify(jobApplicationRepository).delete(job);
    }

    @Test
    void shouldUpdateOnlyTheJobStatus() {
        User user = createUser();
        UUID jobId = UUID.randomUUID();
        JobApplication job = createJob(
                user, "Vaga em andamento", ApplicationStatus.APPLIED);
        job.setId(jobId);
        UpdateJobStatusRequest request = new UpdateJobStatusRequest();
        request.setStatus(ApplicationStatus.IN_PROGRESS);
        when(jobApplicationRepository.findByIdAndUserId(jobId, user.getId()))
                .thenReturn(Optional.of(job));
        when(jobApplicationRepository.save(job))
                .thenReturn(job);
        JobResponse response =
                jobApplicationService.updateJobApplicationStatus(
                        jobId,
                        request,
                        user);
        assertEquals(ApplicationStatus.IN_PROGRESS, response.getStatus());
        assertEquals(ApplicationStatus.IN_PROGRESS, job.getStatus());
        verify(jobApplicationRepository).save(job);
    }

    private User createUser() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("John");
        user.setEmail("john@email.com");
        return user;
    }

    private CreateJobRequest createRequest() {
        CreateJobRequest request = new CreateJobRequest();
        request.setTitle("Desenvolvedor Java");
        request.setCompany("Tech Company");
        request.setDescription("Desenvolvimento de APIs.");
        request.setWorkMode(WorkMode.REMOTE);
        request.setMainRequirements("Java e Spring Boot");

        return request;
    }

    private JobApplication createJob(User user, String title, ApplicationStatus status){
        JobApplication job = new JobApplication();
        job.setId(UUID.randomUUID());
        job.setTitle(title);
        job.setCompany("Tech Company");
        job.setStatus(status);
        job.setUser(user);

        return job;
    }
}