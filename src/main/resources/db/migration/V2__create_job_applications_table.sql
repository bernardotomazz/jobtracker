CREATE TABLE job_applications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    company VARCHAR(150),
    job_url VARCHAR(500),
    location VARCHAR(150),
    salary_range VARCHAR(100),
    work_mode VARCHAR(50),
    main_requirements TEXT,
    desired_requirements TEXT,
    process_details TEXT,
    notes TEXT,
    applied_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_job_applications_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
);