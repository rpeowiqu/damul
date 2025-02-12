package com.damul.api.common.socket;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.jwt.TokenService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;
    private final TokenService tokenService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // 쿠키 헤더에서 토큰 추출
            String cookieHeader = accessor.getFirstNativeHeader("Cookie");
            if (cookieHeader == null) {
                throw new MessageDeliveryException("No cookies provided");
            }

            // 쿠키 파싱
            String accessToken = null;
            String refreshToken = null;
            String[] cookies = cookieHeader.split(";");
            for (String cookie : cookies) {
                String[] parts = cookie.trim().split("=");
                if (parts.length == 2) {
                    if (parts[0].equals("access_token")) {
                        accessToken = parts[1];
                    } else if (parts[0].equals("refresh_token")) {
                        refreshToken = parts[1];
                    }
                }
            }

            try {
                UserInfo userInfo = null;

                // 액세스 토큰 검증
                if (accessToken != null && !jwtTokenProvider.isTokenExpired(accessToken)) {
                    Claims claims = jwtTokenProvider.getClaims(accessToken);
                    userInfo = buildUserInfoFromClaims(claims);
                }
                // 리프레시 토큰으로 검증
                else if (refreshToken != null) {
                    String userEmail = jwtTokenProvider.getUserEmailFromToken(refreshToken);
                    if (tokenService.validateRefreshToken(userEmail, refreshToken)) {
                        Claims claims = jwtTokenProvider.getClaims(refreshToken);
                        userInfo = buildUserInfoFromClaims(claims);
                    } else {
                        throw new MessageDeliveryException("Invalid refresh token");
                    }
                }

                if (userInfo == null) {
                    throw new MessageDeliveryException("Authentication failed");
                }

                // 인증된 사용자 정보 설정
                accessor.setUser(new UsernamePasswordAuthenticationToken(
                        userInfo,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + Role.USER.name()))
                ));

            } catch (Exception e) {
                throw new MessageDeliveryException("Authentication failed: " + e.getMessage());
            }
        }
        return message;
    }

    private UserInfo buildUserInfoFromClaims(Claims claims) {
        Integer userId = claims.get("userId", Integer.class);
        String email = claims.get("email", String.class);
        String nickname = claims.get("nickname", String.class);

        if (userId == null || email == null) {
            throw new IllegalStateException("Required claims are missing from token");
        }

        return UserInfo.builder()
                .id(userId)
                .email(email)
                .nickname(nickname)
                .role(Role.USER.name())
                .build();
    }
}