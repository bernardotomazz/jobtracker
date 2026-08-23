package io.github.bernardotomazz.jobtracker.auth.service;


import io.github.bernardotomazz.jobtracker.auth.dto.AuthResponse;
import io.github.bernardotomazz.jobtracker.auth.dto.LoginRequest;
import io.github.bernardotomazz.jobtracker.auth.dto.RegisterRequest;
import io.github.bernardotomazz.jobtracker.common.exception.EmailAlreadyRegisteredException;
import io.github.bernardotomazz.jobtracker.common.exception.InvalidCredentialsException;
import io.github.bernardotomazz.jobtracker.security.JwtService;
import io.github.bernardotomazz.jobtracker.user.dto.UserResponse;
import io.github.bernardotomazz.jobtracker.user.entity.User;
import io.github.bernardotomazz.jobtracker.user.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
