package com.damul.api.auth.oauth2.handler;

import com.damul.api.auth.oauth2.dto.OAuth2Response;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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
        log.error("예외 메시지: {}", exception.getMessage());

        // 세션에서 OAuth2 이메일 정보 가져오기
        HttpSession session = request.getSession();
        OAuth2Response oAuth2Response = (OAuth2Response) session.getAttribute("oauth2User");

        if (exception.getMessage().equals("약관 동의가 필요합니다.")) {
            log.info("약관동의로 이동");
            // 이메일 정보를 쿼리 파라미터로 전달
            String email = oAuth2Response != null ? oAuth2Response.getEmail() : "";
            String redirectUrl = String.format("http://localhost:3000/terms-agreement?email=%s",
                    URLEncoder.encode(email, StandardCharsets.UTF_8));
            response.setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT);
            response.setHeader("Location", redirectUrl);
            return;
        }

        // 다른 에러의 경우 에러 페이지로 리다이렉트
        String errorMessage = exception.getMessage() != null ? exception.getMessage() : "Unknown error";
        response.sendRedirect("http://localhost:3000/error?error=" +
                URLEncoder.encode(errorMessage, StandardCharsets.UTF_8));
    }
}
