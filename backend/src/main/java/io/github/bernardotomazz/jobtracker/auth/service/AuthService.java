package io.github.bernardotomazz.jobtracker.auth.service;


import io.github.bernardotomazz.jobtracker.auth.dto.AuthResponse;
import io.github.bernardotomazz.jobtracker.auth.dto.LoginRequest;
import io.github.bernardotomazz.jobtracker.auth.dto.RegisterRequest;
import io.github.bernardotomazz.jobtracker.common.exception.EmailAlreadyRegisteredException;
import io.github.bernardotomazz.jobtracker.common.exception.InvalidCredentialsException;
import io.github.bernardotomazz.jobtracker.email.EmailService;
import io.github.bernardotomazz.jobtracker.email.dto.ForgotPasswordRequest;
import io.github.bernardotomazz.jobtracker.email.dto.ResetPasswordRequest;
import io.github.bernardotomazz.jobtracker.email.entity.PasswordResetToken;
import io.github.bernardotomazz.jobtracker.email.repository.PasswordResetTokenRepository;
import io.github.bernardotomazz.jobtracker.security.JwtService;
import io.github.bernardotomazz.jobtracker.user.dto.UserResponse;
import io.github.bernardotomazz.jobtracker.user.entity.User;
import io.github.bernardotomazz.jobtracker.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    @Value("${app.frontend.url}")
    private String frontendUrl;
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, PasswordResetTokenRepository passwordResetTokenRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

    //Metodo para registrar usuário
    public AuthResponse register (RegisterRequest registerRequest) {
        String normalizedEmail = normalizeEmail(registerRequest.getEmail());
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyRegisteredException("Email already registered");
        }
        String passwordHash = passwordEncoder.encode(registerRequest.getPassword());
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordHash);

        User savedUser = userRepository.save(user);
        UserResponse userResponse = new UserResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail());
        String jwt = jwtService.generateToken(savedUser);
        return new AuthResponse(jwt, userResponse);
    }

    //Metodo para logar usuario
    public AuthResponse login (LoginRequest loginRequest) {
        String normalizedEmail = normalizeEmail(loginRequest.getEmail());
        Optional<User> user = userRepository.findByEmail(normalizedEmail);
        if (user.isEmpty()) {
            throw new InvalidCredentialsException("Invalid credentials");
        }
        User userEntity = user.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), userEntity.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }
        UserResponse userResponse = new UserResponse(userEntity.getId(), userEntity.getName(), userEntity.getEmail());
        String jwt = jwtService.generateToken(userEntity);
        return new AuthResponse(jwt, userResponse);
    }

    //Metodo para criar token e enviar link para redefiniçao de senha
    @Transactional
    public void forgotPassword (ForgotPasswordRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        Optional<User> user = userRepository.findByEmail(normalizedEmail);
        if (user.isEmpty()) {
            return;
        }
        User userEntity = user.get();
        Optional<PasswordResetToken> passwordReset = passwordResetTokenRepository.findByUser(userEntity);
        passwordReset.ifPresent(passwordResetTokenRepository::delete);
        UUID token =  UUID.randomUUID();
        String resetLink = frontendUrl+"/reset-password?token=" + token;
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setUser(userEntity);
        passwordResetToken.setToken(token.toString());
        passwordResetTokenRepository.save(passwordResetToken);
        emailService.sendPasswordResetEmail(user.get().getEmail(), resetLink);
    }
    //Metodo para redefiniçao de senha
    @Transactional
    public void resetPassword (ResetPasswordRequest request) {
        Optional<PasswordResetToken> token = passwordResetTokenRepository.findByToken(request.getToken());
        if (token.isEmpty()) {
            throw new InvalidCredentialsException("Invalid token");
        }
        PasswordResetToken passwordResetToken = token.get();
        if (passwordResetToken.isUsed()) {
            throw new InvalidCredentialsException("Token has already been used");
        }
        if (passwordResetToken.getExpiresAt().isBefore(LocalDateTime.now())){
            throw new InvalidCredentialsException("Token has expired");
        }
        User user = passwordResetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        passwordResetToken.setUsed(true);
        passwordResetTokenRepository.delete(passwordResetToken);
    }
    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
