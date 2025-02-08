package com.damul.api.auth.filter;

import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.service.AuthService;
import com.damul.api.auth.util.CookieUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class JwtTokenRefreshFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;
    private final CookieUtil cookieUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            log.info("JwtTokenRefreshFilter 시작");

            Optional<Cookie> accessTokenCookie = cookieUtil.getCookie(request, "access_token");
            Optional<Cookie> refreshTokenCookie = cookieUtil.getCookie(request, "refresh_token");

            log.info("accessToken 존재: {}", accessTokenCookie.isPresent());
            log.info("refreshToken 존재: {}", refreshTokenCookie.isPresent());

            if (accessTokenCookie.isPresent() && refreshTokenCookie.isPresent()) {
                String accessToken = accessTokenCookie.get().getValue();
                String refreshToken = refreshTokenCookie.get().getValue();

                log.info("토큰 검증 시작");
                log.info("accessToken 유효성: {}", jwtTokenProvider.validateToken(accessToken));
                log.info("refreshToken 유효성: {}", jwtTokenProvider.validateToken(refreshToken));

                // 액세스 토큰이 만료되었고, 리프레시 토큰이 유효한 경우
                if (!jwtTokenProvider.validateToken(accessToken) &&
                        jwtTokenProvider.validateToken(refreshToken)) {
                    log.info("토큰 재발급 시작");
                }
            }
        } catch (Exception e) {
            log.error("토큰 갱신 중 에러 발생", e);
        }

        filterChain.doFilter(request, response);
    }
}