package io.github.bernardotomazz.jobtracker.job.specification;

import io.github.bernardotomazz.jobtracker.job.entity.JobApplication;
import io.github.bernardotomazz.jobtracker.job.enums.ApplicationStatus;
import io.github.bernardotomazz.jobtracker.job.enums.WorkMode;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.UUID;

public class JobApplicationSpecification {
    public static Specification<JobApplication> belongsToUser(UUID id){
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(root.get("user").get("id"), id);
    }
    public static Specification<JobApplication> hasStatus(ApplicationStatus status){
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(root.get("status"), status);
    }
    public static Specification<JobApplication> hasWorkMode(WorkMode workMode){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("workMode"), workMode);
    }
    public static Specification<JobApplication> companyContains(String company){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("company")), "%" + company.toLowerCase() + "%");
    }
    public static Specification<JobApplication> searchByTitleOrCompany(String searchText){
        return searchByCompany(searchText).or(searchByTitle(searchText));
    }
    public static Specification<JobApplication> searchByCompany(String company){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("company")), "%" + company.toLowerCase() + "%");
    }
    public static Specification<JobApplication> searchByTitle(String title){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }
    public static Specification<JobApplication> appliedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("appliedAt"), startDate, endDate);
    }
}
