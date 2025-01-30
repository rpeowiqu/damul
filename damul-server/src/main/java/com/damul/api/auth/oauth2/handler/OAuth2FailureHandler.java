package com.damul.api.auth.oauth2.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    private final RedisTemplate<String, String> redisTemplate;  // String으로 변경
    private final ObjectMapper objectMapper;  // ObjectMapper 추가

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.error("OAuth2 로그인 실패: {}", exception.getMessage());

        // Redis 조회 로직 제거
        if (exception.getMessage().equals("약관 동의가 필요합니다.")) {
            String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/terms-agreement")
                    .queryParam("sessionId", request.getSession().getId())
                    .build().toUriString();

            response.sendRedirect(redirectUrl);
            return;
        }

        response.sendRedirect("http://localhost:3000/error?message=" +
                URLEncoder.encode(exception.getMessage(), StandardCharsets.UTF_8));
    }
}
