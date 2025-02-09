package com.damul.api.auth.controller;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.util.CookieUtil;
import com.damul.api.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/test")
public class TestAuthController {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CookieUtil cookieUtil;

    @Autowired
    private UserRepository userRepository;
    @GetMapping("/token")
    public ResponseEntity<?> generateTestToken(@RequestParam int userId, HttpServletResponse response) {
        log.info("userId: {}", userId);
        User testUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Test user not found"));

        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + testUser.getRole().name())
        );

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        testUser.getEmail(),
                        null,
                        authorities
                );

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        // 쿠키에 토큰 설정
        cookieUtil.addCookie(response, "access_token", accessToken,
                (int) tokenProvider.getAccessTokenExpire() / 1000);
        cookieUtil.addCookie(response, "refresh_token", refreshToken,
                (int) tokenProvider.getRefreshTokenExpire() / 1000);

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