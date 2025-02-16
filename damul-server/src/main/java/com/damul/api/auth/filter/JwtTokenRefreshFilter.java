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
import java.util.*;
import java.util.stream.Collectors;


/**
 * JWT 토큰 갱신 필터
 * 요청의 토큰을 검사하고 필요한 경우 갱신하는 필터
 * Access Token 만료 시 Refresh Token을 통한 자동 갱신 처리
 */
@Slf4j
@RequiredArgsConstructor
public class JwtTokenRefreshFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenService tokenService;
    private final CookieUtil cookieUtil;
    private final long accessTokenExpire;  // 생성자로 주입
    private final long refreshTokenExpire; // 생성자로 주입
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // 필터 제외 URL
    private final List<String> excludedUrls = Arrays.asList(
            "/login",
            "/api/v1/auth/consent",
            "/favicon.ico",
            "/v3/api-docs/**",
            "/swagger-ui/**"
    );



    /**
     * 필터 메인 로직
     * 토큰 처리 및 갱신을 담당
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        log.info("===== JWT 토큰 갱신 필터 시작 - URI: {} =====", requestURI);

        try {
            log.info("쿠키 처리 시작");
            processCookies(request, response);
        } catch (Exception e) {
            log.error("토큰 처리 중 에러 발생: {}", e.getMessage(), e);
        } finally {
            log.info("===== JWT 토큰 갱신 필터 종료 - URI: {} =====", requestURI);
            filterChain.doFilter(request, response);
        }
    }


    /**
     * 요청의 쿠키에서 토큰을 추출하고 처리
     * Access Token, Refresh Token, Temporary Token을 처리
     */
    private void processCookies(HttpServletRequest request, HttpServletResponse response) {
        log.debug("쿠키 처리 시작");
        Optional<Cookie> accessTokenCookie = cookieUtil.getCookie(request, "access_token");
        Optional<Cookie> refreshTokenCookie = cookieUtil.getCookie(request, "refresh_token");
        Optional<Cookie> tempTokenCookie = cookieUtil.getCookie(request, "temp_token");


        log.info("쿠키 존재 여부 - Access Token: {}, Refresh Token: {}, Temp Token: {}",
                accessTokenCookie.isPresent(), refreshTokenCookie.isPresent(), tempTokenCookie.isPresent());

        // 임시 토큰 처리
        if (tempTokenCookie.isPresent()) {
            log.info("임시 토큰 처리 시작");
            handleTempToken(tempTokenCookie.get(), response);
        }

        // RTR 적용된 토큰 처리
        if (!accessTokenCookie.isPresent() && refreshTokenCookie.isPresent()) {
            log.info("Refresh Token만 존재하는 케이스 처리 시작");
            handleRefreshTokenOnly(response, refreshTokenCookie.get());
        } else if (accessTokenCookie.isPresent()) {
            log.info("Access Token 처리 시작");
            handleAccessToken(response, accessTokenCookie.get(), refreshTokenCookie);
        }
    }

    /**
     * 임시 토큰 처리
     * 제한된 권한으로 인증 처리
     */
    private void handleTempToken(Cookie tempTokenCookie, HttpServletResponse response) {
        String tempToken = tempTokenCookie.getValue();
        log.info("임시 토큰 유효성 검사 시작");
        if (jwtTokenProvider.validateToken(tempToken)) {
            log.info("임시 토큰 유효성 검사 성공");
            Claims claims = jwtTokenProvider.getClaims(tempToken);
            setSecurityContextForTempToken(claims);
            log.info("임시 토큰으로 SecurityContext 설정 완료");
        } else {
            log.warn("유효하지 않은 임시 토큰 발견 - 쿠키 삭제");
            cookieUtil.deleteCookie(response, "temp_token");
        }
    }

    /**
     * Access Token 처리
     * 토큰 만료 시 RTR 적용하여 갱신
     */
    private void handleAccessToken(HttpServletResponse response, Cookie accessTokenCookie,
                                   Optional<Cookie> refreshTokenCookie) {
        String accessToken = accessTokenCookie.getValue();
        log.info("Access Token 만료 여부 체크 시작");

        if (!jwtTokenProvider.isTokenExpired(accessToken)) {
            log.info("유효한 Access Token 감지");
            setSecurityContextFromClaims(jwtTokenProvider.getClaims(accessToken));
            log.info("Security Context 설정 완료");
            log.debug("유효한 Access Token으로 인증 처리 완료");
        } else if (refreshTokenCookie.isPresent()) {
            log.info("만료된 Access Token 감지, Refresh Token으로 갱신 시도");
            renewTokens(response, refreshTokenCookie.get().getValue());
        } else {
            log.warn("Access Token 만료 및 Refresh Token 부재");
        }
    }

    /**
     * Refresh Token만 있는 경우 처리
     * RTR 적용하여 새로운 토큰 쌍 발급
     */
    private void handleRefreshTokenOnly(HttpServletResponse response, Cookie refreshTokenCookie) {
        String refreshToken = refreshTokenCookie.getValue();
        try {
            String userEmail = jwtTokenProvider.getUserEmailFromToken(refreshToken);
            log.info("Refresh Token 처리 시작 - 사용자: {}", userEmail);

            // 블랙리스트 체크
            if (tokenService.isBlacklisted(refreshToken)) {
                log.warn("블랙리스트에 등록된 Refresh Token 감지 - 사용자: {}", userEmail);
                invalidateTokens(response, userEmail);
                return;
            }


            log.info("Refresh Token 유효성 검증 시작");
            if (tokenService.validateRefreshToken(userEmail, refreshToken)) {
                log.info("Refresh Token 유효성 검증 성공");

                Claims claims = jwtTokenProvider.getClaims(refreshToken);
                Authentication authentication = createAuthenticationFromClaims(claims);


                log.info("새로운 토큰 쌍 생성 시작 (RTR 적용)");
                // RTR 적용하여 새로운 토큰 쌍 발급
                Map<String, String> tokens = tokenService.generateTokenPair(authentication);

                cookieUtil.addCookie(response, "access_token", tokens.get("access_token"),
                        jwtTokenProvider.getAccessTokenExpire());
                cookieUtil.addCookie(response, "refresh_token", tokens.get("refresh_token"),
                        jwtTokenProvider.getRefreshTokenExpire());

                log.info("새로운 토큰 쌍 발급 완료 - 사용자: {}", userEmail);
            } else {
                log.warn("유효하지 않은 Refresh Token - 사용자: {}", userEmail);
                invalidateTokens(response, userEmail);
            }
        } catch (Exception e) {
            log.error("Refresh Token 처리 중 에러 발생: {}", e.getMessage());
            cookieUtil.deleteCookie(response, "refresh_token");
        }
    }

    private void renewTokens(HttpServletResponse response, String refreshToken) {
        log.info("토큰 갱신 프로세스 시작");

        if (jwtTokenProvider.validateToken(refreshToken)) {
            String userEmail = jwtTokenProvider.getUserEmailFromToken(refreshToken);
            log.info("토큰 갱신 시도 - 사용자: {}", userEmail);


            if (tokenService.isBlacklisted(refreshToken)) {
                log.warn("블랙리스트에 등록된 Refresh Token으로 갱신 시도 - 사용자: {}", userEmail);
                invalidateTokens(response, userEmail);
                return;
            }

            if (tokenService.validateRefreshToken(userEmail, refreshToken)) {
                log.info("Refresh Token 검증 성공 - 새로운 토큰 쌍 생성");
                Claims claims = jwtTokenProvider.getClaims(refreshToken);
                Authentication authentication = createAuthenticationFromClaims(claims);

                Map<String, String> tokens = tokenService.generateTokenPair(authentication);

                cookieUtil.addCookie(response, "access_token", tokens.get("access_token"),
                        jwtTokenProvider.getAccessTokenExpire());
                cookieUtil.addCookie(response, "refresh_token", tokens.get("refresh_token"),
                        jwtTokenProvider.getRefreshTokenExpire());

                log.info("토큰 갱신 완료 - 사용자: {}", userEmail);
            } else {
                log.warn("저장된 Refresh Token과 불일치 - 사용자: {}", userEmail);
                invalidateTokens(response, userEmail);
            }
        } else {
            log.warn("유효하지 않은 Refresh Token 형식");
            cookieUtil.deleteCookie(response, "refresh_token");
        }
    }

    private void setSecurityContextFromClaims(Claims claims) {
        Authentication authentication = createAuthenticationFromClaims(claims);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private void setSecurityContextForTempToken(Claims claims) {
        UserInfo userInfo = UserInfo.builder()
                .email(claims.get("email", String.class))
                .nickname(claims.get("nickname", String.class))
                .build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userInfo,
                null,
                Collections.emptyList()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private Authentication createAuthenticationFromClaims(Claims claims) {
        UserInfo userInfo = UserInfo.builder()
                .id(claims.get("userId", Integer.class))
                .email(claims.get("email", String.class))
                .nickname(claims.get("nickname", String.class))
                .role(Role.USER.name())
                .build();

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + Role.USER.name());
        return new UsernamePasswordAuthenticationToken(userInfo, null, Collections.singletonList(authority));
    }

    private void invalidateTokens(HttpServletResponse response, String userEmail) {
        log.info("토큰 무효화 시작 - 사용자: {}", userEmail);
        tokenService.removeRefreshToken(userEmail);
        cookieUtil.deleteCookie(response, "access_token");
        cookieUtil.deleteCookie(response, "refresh_token");
        cookieUtil.deleteCookie(response, "temp_token");
        SecurityContextHolder.clearContext();
        log.info("토큰 무효화 완료 - 사용자: {}", userEmail);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        boolean shouldNotFilter = excludedUrls.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, path));
        log.debug("필터 제외 여부 확인 - URI: {}, 제외: {}", path, shouldNotFilter);
        return shouldNotFilter;
    }
}