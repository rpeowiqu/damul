package com.damul.api.auth.jwt;

import com.damul.api.auth.dto.response.UserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenService {
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;

    public Map<String, String> generateTokenPair(Authentication authentication) {
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        // Refresh Token Redis에 저장
        String userEmail = authentication.getName();
        storeRefreshToken(userEmail, refreshToken);

        return Map.of(
                "access_token", accessToken,
                "refresh_token", refreshToken
        );
    }

    public void storeRefreshToken(String userEmail, String refreshToken) {
        redisTemplate.opsForValue().set(
                "RT:" + userEmail,
                refreshToken,
                jwtTokenProvider.getRefreshTokenExpire(),
                TimeUnit.MILLISECONDS
        );
    }

    public String findRefreshToken(String userEmail) {
        return redisTemplate.opsForValue().get("RT:" + userEmail);
    }

    public void removeRefreshToken(String userEmail) {
        redisTemplate.delete("RT:" + userEmail);
    }

    public boolean validateRefreshToken(String userEmail, String refreshToken) {
        log.info("refresh token: {}", refreshToken);
        String storedRefreshToken = findRefreshToken(userEmail);
        log.info("storedRefreshToken: {}", storedRefreshToken);
        return storedRefreshToken != null && storedRefreshToken.equals(refreshToken);
    }

    public long getAccessTokenExpireTime() {
        return jwtTokenProvider.getAccessTokenExpire();
    }

    public long getRefreshTokenExpireTime() {
        return jwtTokenProvider.getRefreshTokenExpire();
    }
}