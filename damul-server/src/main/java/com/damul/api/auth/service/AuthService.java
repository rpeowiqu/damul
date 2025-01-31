package com.damul.api.auth.service;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Provider;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    @Transactional
    public Map<String, String> processTermsAgreement(String sessionId) {
        try {
            // Redis에서 OAuth2 정보 조회
            String sessionKey = "oauth2:user:" + sessionId;
            String jsonString = redisTemplate.opsForValue().get(sessionKey);

            Map<String, String> oauth2Info = objectMapper.readValue(jsonString,
                    new TypeReference<Map<String, String>>() {});

            // 사용자 엔티티 생성 및 저장
            User user = User.builder()
                    .email(oauth2Info.get("email"))
                    .nickname(oauth2Info.get("nickname"))
                    .profileImageUrl(oauth2Info.get("profileImage"))
                    .provider(Provider.valueOf(oauth2Info.get("provider").toUpperCase()))
                    .role(Role.USER)
                    .termsAgreed(true)
                    .build();

            User savedUser = userRepository.save(user);
            log.info("Saved User: {}", savedUser);  // 저장된 사용자 정보 로깅

            // 토큰 생성 로직 수정
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user.getEmail(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
            );

            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

            // Refresh Token Redis에 저장
            redisTemplate.opsForValue().set(
                    "RT:" + user.getEmail(),
                    refreshToken,
                    jwtTokenProvider.getRefreshTokenExpire(),
                    TimeUnit.MILLISECONDS
            );

            // Redis 임시 정보 삭제
            redisTemplate.delete(sessionKey);

            return Map.of(
                    "accessToken", accessToken,
                    "refreshToken", refreshToken
            );
        } catch (Exception e) {
            log.error("약관 동의 처리 중 오류 발생", e);
            throw new RuntimeException("약관 동의 처리 중 오류가 발생했습니다.", e);
        }
    }

    public Map<String, String> generateTokens(Authentication authentication) {
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        // Refresh Token Redis에 저장
        String userId = authentication.getName(); // 이메일
        redisTemplate.opsForValue().set(
                "RT:" + userId,
                refreshToken,
                jwtTokenProvider.getRefreshTokenExpire(),
                TimeUnit.MILLISECONDS
        );

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken
        );
    }

    // 리프레시 토큰 관련 메서드들
    public String findRefreshToken(String userId) {
        return redisTemplate.opsForValue().get("RT:" + userId);
    }

    public void removeRefreshToken(String userId) {
        redisTemplate.delete("RT:" + userId);
    }

    // 리프레시 토큰 검증 메서드 추가 가능
    public boolean validateRefreshToken(String userId, String refreshToken) {
        String storedRefreshToken = findRefreshToken(userId);
        return storedRefreshToken != null && storedRefreshToken.equals(refreshToken);
    }
}