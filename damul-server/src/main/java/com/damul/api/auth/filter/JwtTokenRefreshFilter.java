package com.damul.api.auth.filter;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.service.AuthService;
import com.damul.api.auth.util.CookieUtil;
import com.damul.api.common.user.CustomUserDetails;
import com.fasterxml.jackson.core.ErrorReportConfiguration;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public class JwtTokenRefreshFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;
    private final CookieUtil cookieUtil;
    private final long accessTokenExpire;  // 생성자로 주입
    private final long refreshTokenExpire; // 생성자로 주입


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Optional<Cookie> accessTokenCookie = null;
        Optional<Cookie> refreshTokenCookie = null;

        try {
            log.info("JwtTokenRefreshFilter 시작");

            accessTokenCookie = cookieUtil.getCookie(request, "access_token");
            refreshTokenCookie = cookieUtil.getCookie(request, "refresh_token");

            log.info("accessToken 존재: {}", accessTokenCookie.isPresent());
            log.info("refreshToken 존재: {}", refreshTokenCookie.isPresent());

            // Case 1: 리프레시 토큰만 존재하는 경우
            if (!accessTokenCookie.isPresent() && refreshTokenCookie.isPresent()) {
                handleRefreshTokenOnly(response, refreshTokenCookie.get());
            }
            // Case 2: 액세스 토큰이 존재하는 경우
            else if (accessTokenCookie.isPresent()) {
                String accessToken = accessTokenCookie.get().getValue();
                // 액세스 토큰이 유효한 경우
                if (!jwtTokenProvider.isTokenExpired(accessToken)) {
                    setSecurityContextFromAccessToken(accessToken);
                }
                // 액세스 토큰이 만료되고 리프레시 토큰이 있는 경우
                else if (refreshTokenCookie.isPresent()) {
                    handleTokenRenewal(response, accessToken, refreshTokenCookie.get().getValue());
                }
            }

        } catch (Exception e) {
            log.error("토큰 갱신 중 에러 발생: {}", e.getMessage(), e);
            // 에러 발생 시 기존 토큰들을 삭제
            try {
                if (refreshTokenCookie != null && refreshTokenCookie.isPresent()) {
                    String userEmail = jwtTokenProvider.getUserEmailFromToken(refreshTokenCookie.get().getValue());
                    authService.removeRefreshToken(userEmail);
                }
                cookieUtil.deleteCookie(response, "access_token");
                cookieUtil.deleteCookie(response, "refresh_token");
                SecurityContextHolder.clearContext();  // 보안 컨텍스트도 클리어
            } catch (Exception ex) {
                log.error("토큰 삭제 중 추가 에러 발생: {}", ex.getMessage(), ex);
            }
        } finally {
            filterChain.doFilter(request, response);
        }
    }

    private void handleRefreshTokenOnly(HttpServletResponse response, Cookie refreshTokenCookie) {
        log.info("====== Refresh Token 전용 처리 시작 ======");
        String refreshToken = refreshTokenCookie.getValue();

        try {
            log.info("Refresh Token 유효성 검사 시작");
            boolean isValid = jwtTokenProvider.validateToken(refreshToken);
            log.info("Refresh Token 유효성: {}", isValid);

            if (!isValid) {
                log.error("유효하지 않은 Refresh Token");
                cookieUtil.deleteCookie(response, "refresh_token");
                return;
            }

            String userEmail = jwtTokenProvider.getUserEmailFromToken(refreshToken);
            log.info("추출된 사용자 이메일: {}", userEmail);

            if (userEmail == null || userEmail.isEmpty()) {
                log.error("Refresh Token에서 사용자 이메일을 추출할 수 없습니다.");
                return;
            }

            log.info("Redis에서 Refresh Token 검증 시작");
            boolean isValidInRedis = authService.validateRefreshToken(userEmail, refreshToken);
            log.info("Redis 검증 결과: {}", isValidInRedis);

            if (!isValidInRedis) {
                log.error("Redis에 저장된 Refresh Token과 일치하지 않습니다.");
                authService.removeRefreshToken(userEmail);
                cookieUtil.deleteCookie(response, "refresh_token");
                return;
            }

            Claims refreshTokenClaims = jwtTokenProvider.getClaims(refreshToken);
            log.info("Refresh Token Claims: {}", refreshTokenClaims);

            UserInfo userInfo = buildUserInfoFromClaims(refreshTokenClaims);
            log.info("생성된 UserInfo: {}", userInfo);

            Authentication authentication = createAuthentication(userInfo);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String newAccessToken = jwtTokenProvider.generateAccessToken(authentication);
            log.info("새로운 Access Token 생성 완료");

            cookieUtil.addCookie(response, "access_token", newAccessToken, accessTokenExpire);
            log.info("새로운 Access Token을 쿠키에 저장 완료");

            log.info("====== Refresh Token 전용 처리 완료 ======");
        } catch (Exception e) {
            log.error("Refresh Token 처리 중 에러 발생: {}", e.getMessage(), e);
            cookieUtil.deleteCookie(response, "refresh_token");
        }
    }

    private void setSecurityContextFromAccessToken(String accessToken) {
        Claims claims = jwtTokenProvider.getClaims(accessToken);
        UserInfo userInfo = buildUserInfoFromClaims(claims);
        Authentication authentication = createAuthentication(userInfo);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.info("Security Context에 '{}' 인증 정보를 저장했습니다", userInfo.getEmail());
    }

    private void handleTokenRenewal(HttpServletResponse response, String accessToken, String refreshToken) {
        if (jwtTokenProvider.validateToken(refreshToken)) {
            String userEmail = jwtTokenProvider.getUserEmailFromToken(refreshToken);

            if (authService.validateRefreshToken(userEmail, refreshToken)) {
                Claims refreshTokenClaims = jwtTokenProvider.getClaims(refreshToken);
                UserInfo userInfo = buildUserInfoFromClaims(refreshTokenClaims);
                Authentication authentication = createAuthentication(userInfo);

                SecurityContextHolder.getContext().setAuthentication(authentication);

                String newAccessToken = jwtTokenProvider.generateAccessToken(authentication);
                cookieUtil.addCookie(response, "access_token", newAccessToken, accessTokenExpire);

                log.info("새로운 액세스 토큰 발급 완료");
            } else {
                log.error("저장된 리프레시 토큰과 일치하지 않습니다.");
                authService.removeRefreshToken(userEmail);
                cookieUtil.deleteCookie(response, "access_token");
                cookieUtil.deleteCookie(response, "refresh_token");
            }
        }
    }

    private UserInfo buildUserInfoFromClaims(Claims claims) {
        return UserInfo.builder()
                .id(claims.get("userId", Integer.class))
                .email(claims.get("email", String.class))
                .nickname(claims.get("nickname", String.class))
                .role(Role.USER.name())
                .build();
    }

    private Authentication createAuthentication(UserInfo userInfo) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + Role.USER.name());
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(authority);
        return new UsernamePasswordAuthenticationToken(userInfo, null, authorities);
    }
}