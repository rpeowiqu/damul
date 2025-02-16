package com.damul.api.auth.jwt;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.common.user.CustomUserDetails;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.jwt.Jwt;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 토큰의 생성, 검증, 정보 추출을 담당하는 서비스
 * Access Token과 Refresh Token의 생성 및 관리를 처리
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class JwtTokenProvider {
    private final SecretKey jwtSecretKey;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpire;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpire;

    @Value("${jwt.temporary-token-expiration}")
    private long temporaryTokenExpire;


    /**
     * Access Token 생성
     * 사용자 인증 정보를 기반으로 JWT Access Token을 생성
     *
     * @param authentication Spring Security 인증 정보
     * @return 생성된 JWT Access Token 문자열
     */
    public String generateAccessToken(Authentication authentication) {
        Map<String, Object> claims = createClaimsFromAuthentication(authentication);
        return generateToken(claims, accessTokenExpire);
    }


    /**
     * Refresh Token 생성
     * Access Token 재발급을 위한 Refresh Token을 생성
     *
     * @param authentication Spring Security 인증 정보
     * @return 생성된 JWT Refresh Token 문자열
     */
    public String generateRefreshToken(Authentication authentication) {
        Map<String, Object> claims = createClaimsFromAuthentication(authentication);
        return generateToken(claims, refreshTokenExpire);
    }

    /**
     * 임시 토큰 생성
     * 제한된 권한을 가진 임시 토큰 생성
     */
    public String generateTempToken(Map<String, Object> claims) {
        return generateToken(claims, temporaryTokenExpire);
    }

    /**
     * 실제 토큰 생성 로직
     * 주어진 claims와 만료 시간으로 JWT 토큰을 생성
     */
    private String generateToken(Map<String, Object> claims, long expiration) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(jwtSecretKey, SignatureAlgorithm.HS512)
                .compact();
    }


    /**
     * Authentication 객체로부터 Claims 생성
     * 다양한 Principal 타입(CustomUserDetails, UserInfo, Jwt)을 처리
     */
    private Map<String, Object> createClaimsFromAuthentication(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        Map<String, Object> claims = new HashMap<>();

        UserInfo userInfo = extractUserInfo(principal);
        if (userInfo != null) {
            claims.put("sub", userInfo.getEmail());
            claims.put("email", userInfo.getEmail());
            claims.put("userId", userInfo.getId());
            claims.put("nickname", userInfo.getNickname());
            claims.put("role", authentication.getAuthorities());
        } else {
            String email = authentication.getName();
            claims.put("sub", email);
            claims.put("email", email);
            claims.put("role", authentication.getAuthorities());
        }

        return claims;
    }

    private UserInfo extractUserInfo(Object principal) {
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUserInfo();
        } else if (principal instanceof UserInfo) {
            return (UserInfo) principal;
        } else if (principal instanceof Jwt) {
            Jwt jwt = (Jwt) principal;
            return UserInfo.builder()
                    .email(jwt.getClaimAsString("email"))
                    .id(jwt.getClaim("userId"))
                    .nickname(jwt.getClaimAsString("nickname"))
                    .build();
        }
        return null;
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(jwtSecretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getUserEmailFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.info("만료된 토큰입니다: {}", e.getMessage());
            return false;
        } catch (JwtException e) {
            log.error("JWT 토큰 검증 실패: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getClaims(token).getExpiration();
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (Exception e) {
            log.error("토큰 만료 확인 중 에러 발생", e);
            return true;
        }
    }

    public long getAccessTokenExpire() {
        return accessTokenExpire;
    }

    public long getRefreshTokenExpire() {
        return refreshTokenExpire;
    }
}
