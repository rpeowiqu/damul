package com.damul.api.auth.jwt;

import com.damul.api.auth.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

/**
 * JWT 토큰의 생성, 검증, 정보 추출을 담당하는 서비스
 * Access Token과 Refresh Token의 생성 및 관리를 처리
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;              // JWT 서명에 사용할 비밀키

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpire;        // Access Token 만료 시간 (ms)

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpire;       // Refresh Token 만료 시간 (ms)

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
        // 이메일 추출 방식 변경
        String email = authentication.getName();

        return Jwts.builder()
                .setSubject(email)    // 사용자 식별자로 이메일 사용
                .claim("roles", authentication.getAuthorities()) // 사용자 권한 정보 포함
                .setIssuedAt(new Date())                        // 토큰 발행 시간
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpire))
                .signWith(getSigninKey(), Jwts.SIG.HS512)  // Base64 디코딩 키 사용
                .compact();
    }


    private SecretKey getSigninKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
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
        // OAuth2User로 캐스팅 대신 getName() 사용
        String email = authentication.getName();

        return Jwts.builder()
                .setSubject(email)
                .claim("role", authentication.getAuthorities())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpire))
                .signWith(getSigninKey(), SignatureAlgorithm.HS512)  // 일관된 키와 알고리즘 사용
                .compact();
    }

    // 임시토큰 생성
    public String generateTempToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + temporaryTokenExpire))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
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
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody()
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
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody();
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
                    .setSigningKey(jwtSecret)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            log.error("잘못된 JWT 토큰");
        } catch (ExpiredJwtException e) {
            log.error("만료된 JWT 토큰");
        } catch (UnsupportedJwtException e) {
            log.error("지원되지 않는 JWT 토큰");
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string이 비어있음");
        }
        return false;
    }
}