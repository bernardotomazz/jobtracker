package io.github.bernardotomazz.jobtracker.security.ratelimiting;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Service;

import java.time.Duration;


@Service
public class RateLimitService {
    private final Cache<String, Bucket> buckets = Caffeine.newBuilder()
            .expireAfterAccess(Duration.ofMinutes(10))
            .maximumSize(10_000)
            .build();

    private Bucket createBucketForPath(String path) {
        Bandwidth limit;
        switch (path) {
            case "/auth/login":
                limit = Bandwidth.builder()
                        .capacity(5)
                        .refillGreedy(5, Duration.ofMinutes(1))
                        .build();
                break;
            case "/auth/forgot-password":
                limit = Bandwidth.builder()
                        .capacity(3)
                        .refillGreedy(1, Duration.ofMinutes(2))
                        .build();
                break;
            case "/auth/reset-password":
                limit = Bandwidth.builder()
                        .capacity(3)
                        .refillGreedy(1, Duration.ofMinutes(5))
                        .build();
                break;
            case "/auth/register":
                limit = Bandwidth.builder()
                        .capacity(3)
                        .refillGreedy(2, Duration.ofMinutes(1))
                        .build();
                break;
            default:
                limit = Bandwidth.builder()
                        .capacity(60)
                        .refillGreedy(60, Duration.ofMinutes(1))
                        .build();
        }
        return Bucket.builder().addLimit(limit).build();
    }
    public boolean tryConsume(String idClient,String path) {
        String key = idClient + ":" + path;
        Bucket bucket = buckets.get(key, k -> createBucketForPath(path));

        return bucket.tryConsume(1);
    }
}
