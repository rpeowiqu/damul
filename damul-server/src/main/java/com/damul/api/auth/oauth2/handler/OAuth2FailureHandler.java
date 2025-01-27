package com.damul.api.auth.oauth2.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler {


    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.error("OAuth2 로그인 실패");
        log.error("예외 클래스: {}", exception.getClass().getName());
        log.error("예외 메시지: {}", exception.getMessage());
        log.error("예외 스택 트레이스: ", exception);

        // 정확한 메시지 확인 및 처리
        String errorMessage = exception.getMessage() != null ? exception.getMessage() : "Unknown OAuth2 Login Error";

        // 약관 동의 필요 여부를 더 명확하게 체크
        if (errorMessage.equals("약관 동의가 필요합니다.") ||
                errorMessage.contains("terms_agreement_required")) {
            // 약관 동의가 필요한 경우 약관 페이지로 리다이렉트
            log.info("약관동의로 이동");
            response.sendRedirect("http://localhost:3000/terms-agreement");
        } else {
            // 그 외 에러는 로그인 페이지로 리다이렉트
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.sendRedirect("http://localhost:3000/login/error?error=" + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8.toString()));
        }
    }
}
