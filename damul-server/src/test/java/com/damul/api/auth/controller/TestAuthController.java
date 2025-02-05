package com.damul.api.auth.controller;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
public class TestAuthController {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/test-token")
    public String generateTestToken() {
        User testUser = userRepository.findById(7)
                .orElseThrow(() -> new RuntimeException("Test user not found"));

        // 명시적으로 권한 생성
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + testUser.getRole().name())
        );

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        testUser.getEmail(),  // 이메일
                        null,  // 패스워드 없음
                        authorities
                );

        return tokenProvider.generateAccessToken(authentication);
    }
}