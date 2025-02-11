package com.damul.api.config;

import com.damul.api.chat.socket.StompHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtDecoder jwtDecoder;
    private final StompHandler stompHandler;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // pub/sub 구조를 위한 메시지 브로커 설정
        registry.enableSimpleBroker("/sub"); // 구독용 prefix
        registry.setApplicationDestinationPrefixes("/pub"); // 발행용 prefix
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:*") // 실제 운영 환경에서는 구체적인 도메인 지정 필요
                .withSockJS()
                .setStreamBytesLimit(512 * 1024) // 512KB
                .setHttpMessageCacheSize(1000)
                .setDisconnectDelay(30 * 1000); // 30초;
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Client로부터 들어오는 메세지를 처리하는 MessageChannel 구성 메소드
        registration.interceptors(stompHandler);
    }

}