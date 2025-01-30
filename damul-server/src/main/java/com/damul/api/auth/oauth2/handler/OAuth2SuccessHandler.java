package com.damul.api.auth.oauth2.handler;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.oauth2.service.CustomOAuth2UserService;
import com.damul.api.auth.repository.UserRepository;
import com.damul.api.auth.service.AuthService;
import com.damul.api.auth.util.CookieUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;


@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {


    private final AuthService authService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final CookieUtil cookieUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 인증 성공, 핸들러 start");

        // 토큰 생성
        Map<String, String> tokens = authService.generateTokens(authentication);

        // 쿠키 설정 로그 추가
        log.info("Access Token 쿠키 설정: {}", tokens.get("accessToken"));
        log.info("Refresh Token 쿠키 설정: {}", tokens.get("refreshToken"));


        // 액세스 토큰 쿠키 생성
        cookieUtil.addCookie(response, "access_token", tokens.get("accessToken"),
                (int) jwtTokenProvider.getAccessTokenExpire() / 1000);

        // 리프레시 토큰 쿠키 생성
        cookieUtil.addCookie(response, "refresh_token", tokens.get("refreshToken"),
                (int) jwtTokenProvider.getRefreshTokenExpire() / 1000);

        // 기존 사용자인 경우 로그 출력
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            log.info("기존 사용자 로그인 성공: {}", email);
        } else {
            log.info("신규 사용자 로그인 성공: {}", email);
        }


        // 리다이렉트
        response.sendRedirect("http://localhost:3000/oauth2/success");
    }
}
