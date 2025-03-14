package com.damul.api.config;

import com.damul.api.auth.filter.JwtTokenRefreshFilter;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.jwt.TokenService;
import com.damul.api.auth.oauth2.handler.OAuth2FailureHandler;
import com.damul.api.auth.oauth2.handler.OAuth2SuccessHandler;
import com.damul.api.auth.oauth2.service.CustomOAuth2UserService;
import com.damul.api.auth.util.CookieUtil;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Value("${redirect.frontUrl}")
    private String frontUrl;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpire;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpire;

    private final JwtDecoder jwtDecoder;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenService tokenService;
    private final CookieUtil cookieUtil;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 보안 설정 비활성화
                .csrf((auth) -> {
                    log.info("CSRF 설정 비활성화");
                    auth.disable();
                })
                // CORS 설정 추가
                .cors(cors -> {
                    log.info("CORS 설정");
                    cors.configurationSource(corsConfigurationSource());
                })
                // JWT 토큰 기반의 리소스 서버 설정
                .oauth2ResourceServer(oauth2 -> {
                    log.info("OAuth2 리소스 서버 설정");
                    oauth2.jwt(jwt -> {
                        jwt.decoder(jwtDecoder)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter());
                    });
                })// refresh 필터 추가
                .addFilterBefore(
                        new JwtTokenRefreshFilter(
                                jwtTokenProvider,
                                tokenService,
                                cookieUtil,
                                accessTokenExpire,    // SecurityConfig에서 @Value로 가져온 값 전달
                                refreshTokenExpire    // SecurityConfig에서 @Value로 가져온 값 전달
                        ),
                        UsernamePasswordAuthenticationFilter.class
                )
                // URL별 접근 권한 설정
                .authorizeHttpRequests((auth) -> {
                    log.info("URL 접근 권한 설정");
                    auth
                            .requestMatchers("/multibranch-webhook-trigger/invoke*").permitAll()
                            .requestMatchers(
                                    "/login",
                                    "/admin/login",
                                    "/api/v1/test/token",
                                    "/api/v1/home/upload/**"
                                    ).permitAll() // 누구나 접근 가능
                            .requestMatchers("/api/v1/auth/**").permitAll() // 인증은 누구나 접근 OK
                            .requestMatchers("/ws/**").authenticated()
                            .requestMatchers("/api/v1/sse/**").permitAll()
                            .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")              // ADMIN 역할만 접근 가능
                            .anyRequest().authenticated();                              // 나머지는 인증 필요
                })

                // OAuth2 로그인 설정
                .oauth2Login(oauth2 -> {
                    log.info("OAuth2 로그인 설정");
                    oauth2
                            .loginPage("/login")
                            .authorizationEndpoint(authorization ->
                                    authorization.baseUri("/oauth2/authorization")  // OAuth2 인증 요청 엔드포인트 설정
                            )
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
                .logout(logout -> logout.disable());

        log.info("Security 설정 완료");
        return http.build();
    }

    // CORS 설정을 위한 Bean
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(frontUrl)); // 프론트엔드 주소
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.addAllowedHeader("Set-Cookie");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @PostConstruct
    public void enableSecurityContextPropagation() {
        // 비동기 스레드에서 SecurityContext 상속 가능하도록 설정
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            List<String> roles = jwt.getClaimAsStringList("role");
            if (roles == null) {
                roles = Collections.emptyList();
            }
            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
        });
        return converter;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
