package com.damul.api.auth.controller;


import com.damul.api.auth.entity.User;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.config.SecurityConfig;
import com.damul.api.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(SecurityConfig.class)
class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    private String testToken;

    @BeforeEach
    public void setup() throws Exception {
        User testUser = userRepository.findById(7)
                .orElseThrow(() -> new RuntimeException("Test user not found"));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                testUser.getEmail(),
                null,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + testUser.getRole().name()))
        );

        // 디버그용: 토큰 생성 과정 확인
        System.out.println("Test User Email: " + testUser.getEmail());
        System.out.println("Test User Role: " + testUser.getRole());

        testToken = tokenProvider.generateAccessToken(authentication);
        System.out.println("Generated Token: " + testToken);
    }

    @Test
    public void testProtectedEndpoint() throws Exception {
        mockMvc.perform(get("/api/protected-endpoint")
                        .header("Authorization", "Bearer " + testToken))
                .andExpect(status().isOk());
    }
}
