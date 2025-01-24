package com.damul.api.damulserver.auth.jwt;

import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
@Slf4j
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpire;    // Access Token 만료 시간 (ms)

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpire;   // Refresh Token 만료 시간 (ms)

    /**
     * Access Token 생성
     * @param authentication 인증 정보
     * @return 생성된 Access Token
     */
    public String generateAccessToken(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(oAuth2User.getAttribute("email"))    // 사용자 이메일
                .claim("roles", authentication.getAuthorities()) // 권한 정보
                .setIssuedAt(new Date())                        // 토큰 발행 시간
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpire))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)  // HS512 알고리즘으로 암호화
                .compact();
    }

    /**
     * Refresh Token 생성
     * @param authentication 인증 정보
     * @return 생성된 Refresh Token
     */
    public String generateRefreshToken(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(oAuth2User.getAttribute("email"))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpire))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    /**
     * 토큰에서 사용자 이메일 추출
     * @param token JWT 토큰
     * @return 사용자 이메일
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
     * 토큰 유효성 검증
     * @param token 검증할 토큰
     * @return 유효성 여부
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