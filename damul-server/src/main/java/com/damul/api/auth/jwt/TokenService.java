package com.damul.api.auth.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 토큰 관리 서비스
 * Access Token과 Refresh Token의 생성, 저장, 검증을 담당
 * Redis를 이용한 Refresh Token 저장 및 RTR(Refresh Token Rotation) 구현
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TokenService {
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private static final String REFRESH_TOKEN_PREFIX = "RT:";
    private static final String BLACKLIST_PREFIX = "BL:";


    /**
     * Access Token과 Refresh Token 쌍 생성
     * RTR(Refresh Token Rotation) 적용: 새로운 Refresh Token 발급 시 이전 토큰은 블랙리스트에 추가
     *
     * @param authentication 인증 정보
     * @return access_token과 refresh_token이 포함된 Map
     */
    public Map<String, String> generateTokenPair(Authentication authentication) {
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        String userEmail = authentication.getName();

        // 이전 Refresh Token이 있다면 블랙리스트에 추가
        String oldRefreshToken = findRefreshToken(userEmail);
        if (oldRefreshToken != null) {
            addToBlacklist(oldRefreshToken, jwtTokenProvider.getRefreshTokenExpire());
            log.debug("이전 Refresh Token을 블랙리스트에 추가: {}", userEmail);
        }

        // 새로운 Refresh Token 저장
        storeRefreshToken(userEmail, refreshToken);
        log.debug("새로운 토큰 쌍 생성 완료: {}", userEmail);

        return Map.of(
                "access_token", accessToken,
                "refresh_token", refreshToken
        );
    }

    /**
     * Refresh Token을 Redis에 저장
     *
     * @param userEmail 사용자 이메일
     * @param refreshToken 저장할 Refresh Token
     */
    public void storeRefreshToken(String userEmail, String refreshToken) {
        String key = getRefreshTokenKey(userEmail);
        redisTemplate.opsForValue().set(
                key,
                refreshToken,
                jwtTokenProvider.getRefreshTokenExpire(),
                TimeUnit.MILLISECONDS
        );
        log.debug("Refresh Token 저장 완료: {}", userEmail);
    }


    /**
     * Redis에서 Refresh Token 조회
     *
     * @param userEmail 사용자 이메일
     * @return 저장된 Refresh Token 또는 null
     */
    public String findRefreshToken(String userEmail) {
        return redisTemplate.opsForValue().get(getRefreshTokenKey(userEmail));
    }

    /**
     * Redis에서 Refresh Token 제거
     *
     * @param userEmail 사용자 이메일
     */
    public void removeRefreshToken(String userEmail) {
        redisTemplate.delete(getRefreshTokenKey(userEmail));
        log.debug("Refresh Token 제거 완료: {}", userEmail);
    }


    /**
     * Refresh Token 유효성 검증
     * Redis에 저장된 토큰과 비교하여 검증
     *
     * @param userEmail 사용자 이메일
     * @param refreshToken 검증할 Refresh Token
     * @return 유효성 여부
     */
    public boolean validateRefreshToken(String userEmail, String refreshToken) {
        String storedToken = findRefreshToken(userEmail);
        boolean isValid = storedToken != null && storedToken.equals(refreshToken);
        log.debug("Refresh Token 검증 결과: {} for {}", isValid, userEmail);
        return isValid;
    }


    /**
     * Refresh Token을 블랙리스트에 추가
     *
     * @param token 블랙리스트에 추가할 토큰
     * @param expiration 만료 시간
     */
    private void addToBlacklist(String token, long expiration) {
        String key = getBlacklistKey(token);
        redisTemplate.opsForValue().set(
                key,
                "blacklisted",
                expiration,
                TimeUnit.MILLISECONDS
        );
        log.debug("토큰을 블랙리스트에 추가: {}", token);
    }

    /**
     * 토큰이 블랙리스트에 있는지 확인
     *
     * @param token 확인할 토큰
     * @return 블랙리스트 포함 여부
     */
    public boolean isBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(getBlacklistKey(token)));
    }

    private String getRefreshTokenKey(String userEmail) {
        return REFRESH_TOKEN_PREFIX + userEmail;
    }

    private String getBlacklistKey(String token) {
        return BLACKLIST_PREFIX + token;
    }

}