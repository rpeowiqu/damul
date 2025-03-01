package com.damul.api.auth.controller;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.service.AuthService;
import com.damul.api.auth.util.CookieUtil;
import com.damul.api.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@RestController
@RequestMapping("/api/v1/test")
@RequiredArgsConstructor
public class TestAuthController {

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpire;        // Access Token 만료 시간 (ms)

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpire;       // Refresh Token 만료 시간 (ms)


    private final JwtTokenProvider tokenProvider;
    private final CookieUtil cookieUtil;
    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final AuthService authService;  // RefreshToken 저장을 위한 서비스 추가

    @GetMapping("/token")
    public ResponseEntity<?> generateTestToken(@RequestParam int userId, HttpServletResponse response) {
        log.info("테스트 토큰 생성 시작 - userId: {}", userId);

        User testUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Test user not found"));

        log.info("사용자 정보 조회 완료: {}", testUser.getEmail());

        UserInfo userInfo = new UserInfo(
                testUser.getId(),
                testUser.getEmail(),
                testUser.getNickname(),
                testUser.getRole().name()
        );

        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + testUser.getRole().name())
        );

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userInfo,
                        null,
                        authorities
                );


        // AuthService의 generateTokens 메서드 사용
        Map<String, String> tokens = authService.generateTokens(authentication);
        String refreshToken = tokens.get("refresh_token");


        // Redis에 RefreshToken 저장
        redisTemplate.opsForValue().set(
                "RT:" + userInfo.getEmail(),
                refreshToken,
                refreshTokenExpire,
                TimeUnit.MILLISECONDS
        );

        // 쿠키에 토큰 설정
        cookieUtil.addCookie(response, "access_token", tokens.get("access_token"), accessTokenExpire);
        cookieUtil.addCookie(response, "refresh_token", tokens.get("refresh_token"), refreshTokenExpire);

        log.info("토큰 생성 및 저장 완료 - email: {}", testUser.getEmail());

        return ResponseEntity.ok("Tokens set in cookies");
    }

    @GetMapping("/protected-endpoint")
    public ResponseEntity<String> protectedEndpoint() {
        // 인증된 사용자의 정보를 가져올 수 있다는 것을 보여주기 위해
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        return ResponseEntity.ok("Authenticated user: " + userEmail);
    }


}