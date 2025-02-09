package com.damul.api.auth.filter;

import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.service.AuthService;
import com.damul.api.auth.util.CookieUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public class JwtTokenRefreshFilter extends OncePerRequestFilter {

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpire;        // Access Token 만료 시간 (ms)

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpire;       // Refresh Token 만료 시간 (ms)

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

                // 토큰 디코딩 시도
                Claims claims = jwtTokenProvider.getClaims(accessToken);
                log.info("Access Token Claims: {}", claims);

                // 액세스 토큰이 만료되었고, 리프레시 토큰이 유효한 경우
                if (!jwtTokenProvider.validateToken(accessToken) &&
                        jwtTokenProvider.validateToken(refreshToken)) {
                    log.info("토큰 재발급 시작");

                    // 리프레시 토큰에서 사용자 이메일 추출
                    String userEmail = jwtTokenProvider.getUserEmailFromToken(refreshToken);

                    // Redis에 저장된 리프레시 토큰과 비교
                    if (authService.validateRefreshToken(userEmail, refreshToken)) {
                        // 리프레시 토큰의 실제 권한 정보 사용
                        Claims refreshTokenClaims = jwtTokenProvider.getClaims(refreshToken);
                        List<SimpleGrantedAuthority> authorities =
                                ((List<String>) refreshTokenClaims.get("role")).stream()
                                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                                        .collect(Collectors.toList());

                        Authentication authentication = new UsernamePasswordAuthenticationToken(
                                userEmail,
                                null,
                                authorities
                        );

                        // 새로운 액세스 토큰 발급
                        String newAccessToken = jwtTokenProvider.generateAccessToken(authentication);

                        // 새로운 액세스 토큰을 쿠키에 설정
                        cookieUtil.addCookie(response, "access_token", newAccessToken, accessTokenExpire);

                        log.info("새로운 액세스 토큰 발급 완료");
                    } else {
                        log.error("저장된 리프레시 토큰과 일치하지 않습니다.");
                        // 모든 토큰 삭제
                        authService.removeRefreshToken(userEmail);
                        cookieUtil.deleteCookie(response, "access_token");
                        cookieUtil.deleteCookie(response, "refresh_token");
                    }
                }
            }
        } catch (Exception e) {
            log.error("토큰 갱신 중 에러 발생", e);
        }

        filterChain.doFilter(request, response);
    }
}