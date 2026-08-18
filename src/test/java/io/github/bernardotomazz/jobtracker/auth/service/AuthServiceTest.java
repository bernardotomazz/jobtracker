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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.mockito.InjectMocks;
import org.mockito.Mock;


import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @InjectMocks
    private AuthService authService;

    @Test
    void shouldRegisterWhenEmailIsAvailable() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("John");
        registerRequest.setEmail("email");
        registerRequest.setPassword("password");

        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("hashed-password");
        User savedUser = new User();
        savedUser.setId(UUID.randomUUID());
        savedUser.setName(registerRequest.getName());
        savedUser.setEmail(registerRequest.getEmail());
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        UserResponse response = authService.register(registerRequest);
        assertEquals(savedUser.getId(),response.getId());
        assertEquals(savedUser.getName(),response.getName());
        assertEquals(savedUser.getEmail(),response.getEmail());
        verify(passwordEncoder).encode(registerRequest.getPassword());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowEmailAlreadyRegisteredExceptionWhenEmailAlreadyExists() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("John");
        registerRequest.setEmail("email");
        registerRequest.setPassword("password");
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);
        assertThrows(EmailAlreadyRegisteredException.class, () -> {
            authService.register(registerRequest);
        });
        verifyNoInteractions(passwordEncoder);
        verify(userRepository, never()).save(any(User.class));
        verify(userRepository).existsByEmail(registerRequest.getEmail());
    }

    @Test
    void shouldLoginWhenCredentialsAreValid() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("email");
        loginRequest.setPassword("password");
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("John");
        user.setEmail("email");
        user.setPasswordHash("hashed-password");
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "hashed-password")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("token-false");
        AuthResponse authResponse = authService.login(loginRequest);
        assertEquals(user.getEmail(), authResponse.getUser().getEmail());
        assertEquals("token-false", authResponse.getToken());
        verify(userRepository).findByEmail(user.getEmail());
        verify(passwordEncoder).matches("password", "hashed-password");
        verify(jwtService).generateToken(user);
    }

    @Test
    void shouldThrowLoginExceptionWhenEmailIsNotValid() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("email");
        loginRequest.setPassword("password");
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.empty());
        assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(loginRequest);
        });
        verify(userRepository).findByEmail(loginRequest.getEmail());
        verifyNoInteractions(passwordEncoder);
        verifyNoInteractions(jwtService);
    }
    @Test
    void shouldThrowLoginExceptionWhenPasswordIsNotValid() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("email");
        loginRequest.setPassword("password");
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("John");
        user.setEmail("email");
        user.setPasswordHash("hashed-password");
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "hashed-password")).thenReturn(false);
        assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(loginRequest);
        });
        verify(userRepository).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder).matches("password", "hashed-password");
        verifyNoInteractions(jwtService);
    }
}
