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
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.Map;


@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

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

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 인증 성공, 핸들러 start");

        // 기존, 신규 회원 여부 확인하기
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // 기존 회원
        if(oAuth2User instanceof CustomUserDetails) {
            log.info("기존 회원입니다.");
            // 토큰 생성
            Map<String, String> tokens = authService.generateTokens(authentication);

            // 액세스 토큰 쿠키 생성
            cookieUtil.addCookie(response, "access_token", tokens.get("accessToken"),
                    (int) jwtTokenProvider.getAccessTokenExpire() / 1000);

            // 리프레시 토큰 쿠키 생성
            cookieUtil.addCookie(response, "refresh_token", tokens.get("refreshToken"),
                    (int) jwtTokenProvider.getRefreshTokenExpire() / 1000);


            // 쿠키 설정 로그 추가
            log.info("Access Token 쿠키 설정: {}", tokens.get("accessToken"));
            log.info("Refresh Token 쿠키 설정: {}", tokens.get("refreshToken"));

            response.sendRedirect(frontUrl + main);

        } else if(oAuth2User instanceof DefaultOAuth2User) {
            log.info("신규 회원입니다.");
            String tempToken = oAuth2User.getAttribute("tempToken");

            // 쿠키로 전달
            cookieUtil.addCookie(response, "temp_token", tempToken, 1800); // 30분 유지

            // 신규 회원이면 약관동의 페이지로 Redirect
            response.sendRedirect(frontUrl+terms);
        }
    }
}
