package io.github.bernardotomazz.jobtracker.email.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class ResetPasswordRequest {
    @NotBlank
    @Size(min = 8, max = 32)
    private String password;
    private String token;
}
