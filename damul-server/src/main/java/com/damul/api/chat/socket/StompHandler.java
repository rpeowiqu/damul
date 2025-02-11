package com.damul.api.chat.socket;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

import java.security.Principal;

@Component
public class StompHandler implements ChannelInterceptor {

    private final JwtDecoder jwtDecoder;

    public StompHandler(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // 연결 시도시 토큰 검증
            String token = accessor.getFirstNativeHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                try {
                    Jwt jwt = jwtDecoder.decode(token);
                    // JWT가 유효한 경우의 처리
                    // 필요한 경우 사용자 정보를 accessor에 저장
                    accessor.setUser(new Principal() {
                        @Override
                        public String getName() {
                            return jwt.getSubject();
                        }
                    });
                } catch (Exception e) {
                    throw new MessageDeliveryException("Invalid JWT token");
                }
            } else {
                throw new MessageDeliveryException("No JWT token provided");
            }
        }
        return message;
    }
}