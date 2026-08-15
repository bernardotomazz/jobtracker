package io.github.bernardotomazz.jobtracker.auth.controller;

import io.github.bernardotomazz.jobtracker.auth.dto.AuthResponse;
import io.github.bernardotomazz.jobtracker.auth.dto.LoginRequest;
import io.github.bernardotomazz.jobtracker.auth.dto.RegisterRequest;
import io.github.bernardotomazz.jobtracker.auth.service.AuthService;
import io.github.bernardotomazz.jobtracker.user.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest registerRequest){
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest loginRequest){
        return authService.login(loginRequest);
    }
}
