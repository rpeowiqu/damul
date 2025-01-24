package com.damul.api.damulserver.config;

import com.damul.api.damulserver.auth.oauth2.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Slf4j
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf((auth) -> auth.disable())
                .authorizeHttpRequests(
                        (auth) -> auth
                                .requestMatchers("/", "/login", "/admin/login").permitAll()
                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(new JwtAuthenticationConverter())
                        )
                )
                .oauth2Login(oauth2 -> oauth2
                        .userService(customOAuth2UserService)
                        .successHandler((request, response, authentication) -> {
                            OAuth2User uAuth2User = (OAuth2User) authentication.getPrincipal();
                            customOAuth2UserService.registerUser(oAuth2User);
                            response.sendRedirect("/");
                        }));
        return http.build();
    }
}
