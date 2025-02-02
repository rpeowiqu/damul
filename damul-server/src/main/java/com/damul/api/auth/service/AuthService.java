package com.damul.api.auth.service;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.repository.AuthRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthRepository authRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;


    @Transactional
    public Map<String, String> processSignup(String tempToken, String nickname) {
            log.info("임시 토큰에서 OAuth2 인증 정보 추출 시작");
            // 1. 임시 토큰에서 OAuth2 인증 정보 추출
            Claims claims = jwtTokenProvider.getClaims(tempToken);
            String email = claims.get("email", String.class);

            log.info("이메일 - email: {}", email);

            log.info("Redis 조회");
            // 2. Redis에서 저장된 유저 정보 가져오기
            String sessionKey = "oauth2:user:" + RequestContextHolder.currentRequestAttributes().getSessionId();
            String jsonString = redisTemplate.opsForValue().get(sessionKey);

            if (jsonString == null) {
                throw new RuntimeException("유저 정보를 찾을 수 없습니다.");
            }

            try {

                // Redis에 저장된 User 정보 파싱
                User user = objectMapper.readValue(jsonString, User.class);
                log.info("닉네임 적용 전 - nickname: {}", user.getNickname());

                // 수정된 닉네임 적용
                user.builder()
                        .nickname(nickname);

                log.info("닉네임 적용 완료 - nickname: {}", user.getNickname());

                // DB에 저장
                User savedUser = authRepository.save(user);
                log.info("회원 가입 완료: {}", email);

                // 토큰 생성
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(savedUser.getRole().name()))
                );

                String accessToken = jwtTokenProvider.generateAccessToken(authentication);
                String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

                // Refresh Token Redis에 저장
                redisTemplate.opsForValue().set(
                        "RT:" + savedUser.getEmail(),
                        refreshToken,
                        jwtTokenProvider.getRefreshTokenExpire(),
                        TimeUnit.MILLISECONDS
                );

                // 임시 저장된 OAuth 정보 삭제
                redisTemplate.delete(sessionKey);

                return Map.of(
                        "accessToken", accessToken,
                        "refreshToken", refreshToken
                );
        } catch (Exception e) {
            log.error("회원가입 처리 중 오류 발생", e);
            throw new RuntimeException("유저 정보 파싱 중 오류가 발생했습니다.", e);
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

    public String findRefreshToken(String userId) {
        return redisTemplate.opsForValue().get("RT:" + userId);
    }

    public void removeRefreshToken(String userId) {
        redisTemplate.delete("RT:" + userId);
    }

    public boolean validateRefreshToken(String userId, String refreshToken) {
        String storedRefreshToken = findRefreshToken(userId);
        return storedRefreshToken != null && storedRefreshToken.equals(refreshToken);
    }
}