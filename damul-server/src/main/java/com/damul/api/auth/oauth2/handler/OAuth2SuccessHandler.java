package com.damul.api.auth.oauth2.handler;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 로그인 성공");

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        // Access Token과 Refresh Token을 쿠키에 저장
        response.addCookie(createCookie("access_token", accessToken, 3600)); // 1시간
        response.addCookie(createCookie("refresh_token", refreshToken, 604800)); // 7일

        // 프론트엔드 페이지로 리다이렉트
        response.sendRedirect("http://localhost:3000/oauth2/success");
    }


    private Cookie createCookie(String key, String value, int maxAge) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        // cookie.setSecure(true);  // HTTPS 환경에서 활성화
        return cookie;
    }
}
