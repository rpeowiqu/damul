package com.damul.api.config;


import com.damul.api.auth.oauth2.handler.OAuth2FailureHandler;
import com.damul.api.auth.oauth2.handler.OAuth2SuccessHandler;
import com.damul.api.auth.oauth2.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Slf4j
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 보안 설정 비활성화
                .csrf((auth) -> {
                    log.info("CSRF 설정 비활성화");
                    auth.disable();
                })
                // URL별 접근 권한 설정
                .authorizeHttpRequests((auth) -> {
                    log.info("URL 접근 권한 설정");
                    auth
                            .requestMatchers("/", "/login", "/admin/login").permitAll() // 누구나 접근 가능
                            .requestMatchers("/api/v1/auth/**").permitAll() // 인증은 누구나 접근 OK
                            .requestMatchers("/admin/**").hasRole("ADMIN")              // ADMIN 역할만 접근 가능
                            .anyRequest().authenticated();                              // 나머지는 인증 필요
                })
                // JWT 토큰 기반의 리소스 서버 설정
                .oauth2ResourceServer(oauth2 -> {
                    log.info("OAuth2 리소스 서버 설정");
                    oauth2.jwt(jwt ->
                            jwt.jwtAuthenticationConverter(new JwtAuthenticationConverter())
                    );
                })
                // OAuth2 로그인 설정
                .oauth2Login(oauth2 -> {
                    log.info("OAuth2 로그인 설정");
                    oauth2
                            .userInfoEndpoint(userInfo -> {
                                log.info("OAuth2 사용자 정보 엔드포인트 설정");
                                userInfo.userService(customOAuth2UserService); // OAuth2 인증 후 사용자 정보를 처리하는 서비스
                            })
                            .successHandler(oAuth2SuccessHandler)    // 인증 성공 시 처리 (JWT 토큰 생성, 리다이렉트 등)
                            .failureHandler(oAuth2FailureHandler);   // 인증 실패 시 에러 처리 및 리다이렉트
                })
                // 세션 관리 설정 (JWT 사용으로 무상태 세션 정책 사용)
                .sessionManagement(session -> {
                    log.info("세션 관리 설정: STATELESS");
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                // 로그아웃
                .logout(logout -> {
                    log.info("로그아웃 설정");
                    logout
                            .logoutUrl("/api/v1/auth/logout")
                            .logoutSuccessUrl("/api/v1/auth/login") // 로그인 창으로 이동
                            .clearAuthentication(true);
                })
                // CORS 설정 추가
                .cors(cors -> {
                    log.info("CORS 설정");
                    cors.configurationSource(corsConfigurationSource());
                });
        log.info("Security 설정 완료");
        return http.build();
    }

    // CORS 설정을 위한 Bean
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // 프론트엔드 주소
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.addAllowedHeader("Set-Cookie");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
