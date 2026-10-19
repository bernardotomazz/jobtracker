CREATE TABLE password_reset_token (
    id UUID primary key,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    used boolean NOT NULL,
    created_at TIMESTAMP NOT NULL
);