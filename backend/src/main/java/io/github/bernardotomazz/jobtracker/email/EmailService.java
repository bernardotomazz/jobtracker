package io.github.bernardotomazz.jobtracker.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;


@Service
public class EmailService {

    private final String fromEmail;
    private final RestClient restClient;

    public EmailService(
            @Value("${resend.api.key}") String apiKey,
            @Value("${resend.from.email}") String fromEmail
    ) {
        this.fromEmail = fromEmail;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public void sendEmail(String to, String subject, String text) {
        Map<String, Object> payload = Map.of(
                "from", this.fromEmail,
                "to", List.of(to),
                "subject", subject,
                "text", text
        );
        restClient.post()
                .uri("/emails")
                .body(payload)
                .retrieve()
                .toBodilessEntity();
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        sendEmail(to, "Reset Password", "O link para redefinição de senha é " + resetLink);
    }
}
