package com.damul.api.auth.oauth2.handler;

import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.oauth2.service.CustomOAuth2UserService;
import com.damul.api.auth.repository.AuthRepository;
import com.damul.api.auth.service.AuthService;
import com.damul.api.auth.util.CookieUtil;
import com.damul.api.common.user.CustomUserDetails;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;


@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {


    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpire;        // Access Token 만료 시간 (ms)

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpire;       // Refresh Token 만료 시간 (ms)

    @Value("${jwt.temporary-token-expiration}")
    private long temporaryTokenExpire;

    @Value("${redirect.frontUrl}")
    private String frontUrl;

    @Value("${redirect.main}")
    private String main;

    @Value("${redirect.terms}")
    private String terms;

    private final AuthService authService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthRepository authRepository;
    private final CookieUtil cookieUtil;
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 인증 성공, 핸들러 start");

        // 기존, 신규 회원 여부 확인하기
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // 기존 회원
        if(oAuth2User instanceof CustomUserDetails) {
            log.info("기존 회원입니다.");

            CustomUserDetails userDetails = (CustomUserDetails) oAuth2User;
            String userEmail = userDetails.getEmail();
            log.info("OAuth2Success !!! userEmail: " + userEmail);

            // 토큰 생성
            Map<String, String> tokens = authService.generateTokens(authentication);
            String refreshToken = tokens.get("refresh_token");

            // Redis에 RefreshToken 저장
            redisTemplate.opsForValue().set(
                    "RT:" + userEmail,
                    refreshToken,
                    refreshTokenExpire,
                    TimeUnit.MILLISECONDS
            );


            // Refresh Token 저장 로그 추가
            log.info("Refresh Token이 Redis에 저장되었습니다. userEmail: {}, refreshToken: {}", userEmail, refreshToken);

            cookieUtil.addCookie(response, "access_token", tokens.get("access_token"), accessTokenExpire);
            cookieUtil.addCookie(response, "refresh_token", refreshToken, refreshTokenExpire);



            // 쿠키 설정 로그 추가
            log.info("Access Token 쿠키 설정: {}", tokens.get("access_token"));
            log.info("Refresh Token 쿠키 설정: {}", tokens.get("refresh_token"));

            response.sendRedirect(frontUrl + main);

        } else if(oAuth2User instanceof DefaultOAuth2User) {
            log.info("신규 회원입니다.");
            String tempToken = oAuth2User.getAttribute("temp_token");

            // 쿠키로 전달
            cookieUtil.addCookie(response, "temp_token", tempToken, temporaryTokenExpire); // 30분 유지

            // 신규 회원이면 약관동의 페이지로 Redirect
            response.sendRedirect(frontUrl+terms);
        }
    }
}
