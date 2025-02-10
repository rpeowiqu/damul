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
        Object principal = authentication.getPrincipal();
        String email;
        Map<String, Object> claims = new HashMap<>();  // 일반 HashMap 사용

        log.info("------------------------principal:{}", principal);
        log.info("------------------------principalType:{}", principal.getClass().getSimpleName());

        if (principal instanceof CustomUserDetails) {
            CustomUserDetails customUserDetails = (CustomUserDetails) principal;
            UserInfo userInfo = customUserDetails.getUserInfo(); // 필드에 직접 접근

            log.info("JwtTokenProvider: principal is CustomUserDetails");
            log.info("UserInfo: {}", userInfo);

            email = userInfo.getEmail();
            claims.put("sub", email);
            claims.put("email", email);
            claims.put("userId", userInfo.getId());
            claims.put("nickname", userInfo.getNickname());
            claims.put("role", authentication.getAuthorities());
        } else if (principal instanceof UserInfo) {
            UserInfo userInfo = (UserInfo) principal;
            email = userInfo.getEmail();
            claims.put("sub", email);
            claims.put("email", email);
            claims.put("userId", userInfo.getId());
            claims.put("nickname", userInfo.getNickname());
            claims.put("role", authentication.getAuthorities());
        }  else if (principal instanceof Jwt) {
            Jwt jwt = (Jwt) principal;

            log.info("========================= JWT 상세 정보 =========================");
            log.info("Claims: {}", jwt.getClaims());

            email = jwt.getClaimAsString("email");
            claims.put("sub", email);
            claims.put("email", email);
            claims.put("userId", jwt.getClaim("userId"));
            claims.put("nickname", jwt.getClaimAsString("nickname"));
            claims.put("role", authentication.getAuthorities());
        } else {
            email = authentication.getName();
            claims.put("sub", email);
            claims.put("email", email);
            claims.put("role", authentication.getAuthorities());
        }

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpire))
                .signWith(jwtSecretKey, SignatureAlgorithm.HS512)
                .compact();
    }



    /**
     * Access Token의 만료 시간을 반환
     * @return Access Token 만료 시간 (밀리초)
     */
    public long getAccessTokenExpire() {
        return accessTokenExpire;
    }

    /**
     * Refresh Token의 만료 시간을 반환
     * @return Refresh Token 만료 시간 (밀리초)
     */
    public long getRefreshTokenExpire() {
        return refreshTokenExpire;
    }

    /**
     * Refresh Token 생성
     * Access Token 재발급을 위한 Refresh Token을 생성
     *
     * @param authentication Spring Security 인증 정보
     * @return 생성된 JWT Refresh Token 문자열
     */
    public String generateRefreshToken(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        Map<String, Object> claims = new HashMap<>();
        if (principal instanceof UserInfo) {
            UserInfo userInfo = (UserInfo) principal;
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

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpire))
                .signWith(jwtSecretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    // 임시토큰 생성
    public String generateTempToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + temporaryTokenExpire))
                .signWith(jwtSecretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * JWT 토큰에서 사용자 이메일 추출
     *
     * @param token JWT 토큰 문자열
     * @return 토큰에서 추출한 사용자 이메일
     */
    public String getUserEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(jwtSecretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /**
     * JWT 토큰에서 Claims(페이로드) 추출
     *
     * @param token JWT 토큰 문자열
     * @return 토큰에 포함된 모든 Claims
     */
    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(jwtSecretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * JWT 토큰의 유효성 검증
     * 토큰의 형식, 서명, 만료 여부 등을 검사
     *
     * @param token 검증할 JWT 토큰
     * @return 토큰의 유효성 여부 (true: 유효, false: 무효)
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(jwtSecretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.info("만료된 토큰입니다: {}", e.getMessage());
            return false;
        } catch (SecurityException | MalformedJwtException e) {
            log.error("잘못된 JWT 서명입니다: {}", e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            log.error("지원되지 않는 JWT 토큰입니다: {}", e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            log.error("JWT 토큰이 잘못되었습니다: {}", e.getMessage());
            return false;
        }
    }

    // 토큰이 만료되었는지만 체크하는 별도의 메서드 추가
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getClaims(token);
            Date expiration = claims.getExpiration();
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (Exception e) {
            log.error("토큰 만료 확인 중 에러 발생", e);
            return true;
        }
    }
}