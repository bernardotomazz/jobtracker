package io.github.bernardotomazz.jobtracker.auth.dto;

import io.github.bernardotomazz.jobtracker.user.dto.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private UserResponse user;
}