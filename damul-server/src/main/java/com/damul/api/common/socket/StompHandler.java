package com.damul.api.common.socket;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.jwt.TokenService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class StompHandler implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        log.info("StompHandler - Command: {}", accessor.getCommand());
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            log.info("Stomp CONNECT command received");

            // WebSocket 세션에서 저장된 UserInfo를 가져옴
            UserInfo userInfo = (UserInfo) accessor.getSessionAttributes().get("USER_INFO");

            if (userInfo != null) {
                Authentication auth = createAuthentication(userInfo);

                // StompHeaderAccessor에 인증 정보 설정
                accessor.setUser(auth);
                log.info("Stomp connection authenticated for user: {}", userInfo.getEmail());
            } else {
                log.warn("No valid user info found during CONNECT");
                throw new MessageDeliveryException("No authentication");
            }
        } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            Principal user = accessor.getUser();
            if (user != null) {
                log.info("User {} subscribing to topic", user.getName());
            }
        } else if (StompCommand.SEND.equals(accessor.getCommand())) {
            Principal user = accessor.getUser();
            if (user != null) {
                log.info("Message received from user: {}", user.getName());
            }
        }
        return message;
    }

    private Authentication createAuthentication(UserInfo userInfo) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + Role.USER.name());
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(authority);
        return new UsernamePasswordAuthenticationToken(userInfo, null, authorities);
    }
}