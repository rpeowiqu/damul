package com.damul.api.auth.filter;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.jwt.TokenService;
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
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public class JwtTokenRefreshFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenService tokenService;
    private final CookieUtil cookieUtil;
    private final long accessTokenExpire;  // 생성자로 주입
    private final long refreshTokenExpire; // 생성자로 주입
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final List<String> excludedUrls = Arrays.asList(
            "/login",
            "/api/v1/auth/consent",
            "/favicon.ico",
            "/v3/api-docs/**",
            "/swagger-ui/**"
    );


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Optional<Cookie> accessTokenCookie = null;
        Optional<Cookie> refreshTokenCookie = null;
        Optional<Cookie> tempTokenCookie = null;

        try {
            log.info("JwtTokenRefreshFilter 시작");

            accessTokenCookie = cookieUtil.getCookie(request, "access_token");
            refreshTokenCookie = cookieUtil.getCookie(request, "refresh_token");
            tempTokenCookie = cookieUtil.getCookie(request, "temp_token");

            if (tempTokenCookie.isPresent()) {
                String tempToken = tempTokenCookie.get().getValue();

                // 토큰 유효성 검증
                if (jwtTokenProvider.validateToken(tempToken)) {
                    Claims claims = jwtTokenProvider.getClaims(tempToken);

                    // 최소한의 인증 정보 생성
                    UserInfo userInfo = UserInfo.builder()
                            .email(claims.get("email", String.class))
                            .nickname(claims.get("nickname", String.class))
                            .build();

                    // 제한된 권한으로 인증 정보 설정
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            userInfo,
                            null,
                            Collections.emptyList()  // 권한 없음
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("임시토큰으로 제한적 인증 처리: {}", userInfo.getEmail());
                } else {
                    // 토큰이 유효하지 않은 경우 로그 및 오류 처리
                    log.warn("유효하지 않은 임시토큰 감지 - 쿠키 삭제");
                    cookieUtil.deleteCookie(response, "temp_token");
                }
            }

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
        } finally {
            filterChain.doFilter(request, response);
        }
    }

    private void handleRefreshTokenOnly(HttpServletResponse response, Cookie refreshTokenCookie) {
        log.info("====== Refresh Token 전용 처리 시작 ======");
        String refreshToken = refreshTokenCookie.getValue();

        try {
            String userEmail = jwtTokenProvider.getUserEmailFromToken(refreshToken);
            log.info("1. 추출된 사용자 이메일: {}", userEmail);

            // 실제 Redis에 저장된 값 확인
            String storedToken = tokenService.findRefreshToken(userEmail);
            log.info("2. Redis에 저장된 토큰: {}", storedToken);
            log.info("3. 현재 쿠키의 토큰: {}", refreshToken);

            log.info("4. Redis에서 Refresh Token 검증 시작");
            boolean isValidInRedis = tokenService.validateRefreshToken(userEmail, refreshToken);
            log.info("5. Redis 검증 결과: {}", isValidInRedis);

            if (!isValidInRedis) {
                log.error("Redis에 저장된 Refresh Token과 일치하지 않습니다.");
                tokenService.removeRefreshToken(userEmail);
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
        try {
            if (jwtTokenProvider.validateToken(refreshToken)) {

                // 디버깅을 위한 로그 추가
                Claims refreshTokenClaims2 = jwtTokenProvider.getClaims(refreshToken);
                log.info("Refresh Token Claims: {}", refreshTokenClaims2);  // 모든 claims 출력

                String userEmail = jwtTokenProvider.getUserEmailFromToken(refreshToken);
                log.info("User Email from refresh token: {}", userEmail);


                if (tokenService.validateRefreshToken(userEmail, refreshToken)) {
                    Claims refreshTokenClaims = jwtTokenProvider.getClaims(refreshToken);


                    // Claims 유효성 검증
                    if (refreshTokenClaims.get("userId") == null) {
                        log.error("Refresh token missing userId claim");
                        throw new IllegalStateException("Invalid refresh token claims");
                    }

                    UserInfo userInfo = buildUserInfoFromClaims(refreshTokenClaims);
                    Authentication authentication = createAuthentication(userInfo);

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    String newAccessToken = jwtTokenProvider.generateAccessToken(authentication);
                    cookieUtil.addCookie(response, "access_token", newAccessToken, accessTokenExpire);

                    log.info("새로운 액세스 토큰 발급 완료");
                } else {
                    handleInvalidToken(response, userEmail);
                }
            }
        } catch (Exception e) {
            log.error("Token renewal failed", e);
            cookieUtil.deleteCookie(response, "access_token");
            cookieUtil.deleteCookie(response, "refresh_token");
        }
    }

    private UserInfo buildUserInfoFromClaims(Claims claims) {
        Integer userId = claims.get("userId", Integer.class);
        String email = claims.get("email", String.class);
        String nickname = claims.get("nickname", String.class);

        if (userId == null || email == null) {
            log.error("Required claims missing - userId: {}, email: {}", userId, email);
            throw new IllegalStateException("Required claims are missing from token");
        }

        return UserInfo.builder()
                .id(userId)
                .email(email)
                .nickname(nickname)
                .role(Role.USER.name())
                .build();
    }

    private Authentication createAuthentication(UserInfo userInfo) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + Role.USER.name());
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(authority);
        return new UsernamePasswordAuthenticationToken(userInfo, null, authorities);
    }

    private void handleInvalidToken(HttpServletResponse response, String userEmail) {
        log.error("저장된 리프레시 토큰과 일치하지 않습니다.");
        tokenService.removeRefreshToken(userEmail);
        cookieUtil.deleteCookie(response, "access_token");
        cookieUtil.deleteCookie(response, "refresh_token");
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        boolean shouldNotFilter = excludedUrls.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, path));
        log.debug("JWT 필터 제외 여부 확인 - URI: {}, 제외: {}", path, shouldNotFilter);
        return shouldNotFilter;
    }
}