package com.damul.api.common.socket;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.jwt.TokenService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenProvider jwtTokenProvider;
    private final TokenService tokenService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;

            log.info("WebSocket Handshake 시작");

            // 요청에서 쿠키 가져오기
            String accessToken = extractTokenFromCookie(servletRequest.getServletRequest(), "access_token");
            String refreshToken = extractTokenFromCookie(servletRequest.getServletRequest(), "refresh_token");

            log.info("토큰 추출 - access: {}, refresh: {}",
                    accessToken != null ? "존재" : "없음",
                    refreshToken != null ? "존재" : "없음");

            if (accessToken != null && jwtTokenProvider.validateToken(accessToken)) {
                // 토큰에서 사용자 정보 추출
                Claims claims = jwtTokenProvider.getClaims(accessToken);
                UserInfo userInfo = buildUserInfoFromClaims(claims);

                // Authentication 객체 생성
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + Role.USER.name())
                );

                Authentication auth = new UsernamePasswordAuthenticationToken(
                        userInfo,
                        null,
                        authorities
                );

                // SecurityContext에 인증 정보 설정
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.info("Authentication: {}", auth);
                log.info("SecurityContext: {}", SecurityContextHolder.getContext().getAuthentication());
                // WebSocket 세션에도 인증 정보 저장
                attributes.put("USER_INFO", userInfo);
                attributes.put("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

                log.info("WebSocket Handshake 인증 성공 - user: {}", userInfo.getEmail());
                return true;
            }

            log.warn("WebSocket Handshake 인증 실패");
            return false;
        }

        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception ex) {
        // Handshake 후처리가 필요한 경우 여기에 구현
    }

    private String extractTokenFromCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private UserInfo buildUserInfoFromClaims(Claims claims) {
        return UserInfo.builder()
                .id(claims.get("userId", Integer.class))
                .email(claims.get("email", String.class))
                .nickname(claims.get("nickname", String.class))
                .role(Role.USER.name())  // JwtTokenProvider와 일관성을 위해 Role.USER로 설정
                .build();
    }
}