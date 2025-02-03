package com.damul.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;

import static org.springframework.messaging.simp.SimpMessageType.MESSAGE;
import static org.springframework.messaging.simp.SimpMessageType.SUBSCRIBE;

@Configuration
public class WebSocketSecurityConfig {
//
//    @Bean
//    public AuthorizationManager<Message<?>> messageAuthorizationManager(MessageMatcherDelegatingAuthorizationManager.Builder messages) {
//        messages
//                .nullDestMatcher().authenticated() // MESSAGE or SUBSCRIPBE 메세지 유형이 아니면 인증
//                .simpSubscribeDestMatchers("/user/queue/errors").permitAll() // 에러메세지를 받는 엔드포인트는 다 허용
//                .simpDestMatchers("/app/**").hasAuthority("USER") // /app으로 시작하는 모든 메세지 발행은 USER만 가능
//                .simpSubscribeDestMatchers("/user/**", "/topic/friends/*").hasAuthority("USER") // 적힌 패턴의 구독은 USER만 가능
//                .simpTypeMatchers(MESSAGE, SUBSCRIBE).denyAll() // 위에 명시적으로 허용되지 않은 MESSAGE와 SUBSCRIBE 타입의 모든 메세지는 거부
//                .anyMessage().denyAll(); // 나머지 다 거부
//
//        return messages.build();
//    }

}
