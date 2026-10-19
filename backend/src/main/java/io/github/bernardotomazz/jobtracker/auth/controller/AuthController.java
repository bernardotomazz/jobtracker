package io.github.bernardotomazz.jobtracker.auth.controller;

import io.github.bernardotomazz.jobtracker.auth.dto.AuthResponse;
import io.github.bernardotomazz.jobtracker.auth.dto.LoginRequest;
import io.github.bernardotomazz.jobtracker.auth.dto.RegisterRequest;
import io.github.bernardotomazz.jobtracker.auth.service.AuthService;
import io.github.bernardotomazz.jobtracker.email.dto.ForgotPasswordRequest;
import io.github.bernardotomazz.jobtracker.email.dto.ResetPasswordRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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
    public AuthResponse register(@Valid @RequestBody RegisterRequest registerRequest){
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest loginRequest){
        return authService.login(loginRequest);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity forgotPassword (@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        authService.forgotPassword(forgotPasswordRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity resetPassword (@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        authService.resetPassword(resetPasswordRequest);
        return ResponseEntity.ok().build();
    }

}
