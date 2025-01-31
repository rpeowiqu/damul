package com.damul.api.auth.controller;

import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.repository.UserRepository;
import com.damul.api.auth.service.AuthService;
import com.damul.api.auth.util.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;
    private final CookieUtil cookieUtil;

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // 쿠키에서 JWT 토큰 제거
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("access_token") ||
                        cookie.getName().equals("refresh_token")) {
                    cookie.setValue("");
                    cookie.setPath("/");
                    cookie.setMaxAge(0);
                    response.addCookie(cookie);
                }
            }
        }

        return ResponseEntity.ok().body("Successfully logged out");
    }

    // 약관 동의 후 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> agreeToTerms(HttpServletRequest request, HttpServletResponse response) {
        String sessionId = request.getSession().getId();

        Map<String, String> tokens = authService.processSignup(sessionId);

        // 쿠키 설정
        cookieUtil.addCookie(response, "access_token", tokens.get("accessToken"),
                (int) jwtTokenProvider.getAccessTokenExpire() / 1000);
        cookieUtil.addCookie(response, "refresh_token", tokens.get("refreshToken"),
                (int) jwtTokenProvider.getRefreshTokenExpire() / 1000);


        return ResponseEntity.ok()
                .body(Map.of(
                        "success", true,
                        "redirectUrl", "/"
                ));
    }
}
//
//    // 회원 정보 수정
//    @PutMapping("/user/update")
//    public ResponseEntity<?> updateUserInfo(
//            @AuthenticationPrincipal OAuth2User oauth2User,
//            @RequestBody UserUpdateRequest request) {
//        String email = oauth2User.getAttribute("email");
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        user.updateProfile(request.getNickname(), request.getProfileImageUrl());
//        userRepository.save(user);
//
//        return ResponseEntity.ok(user);
//    }
//
//    // 회원 탈퇴
//    @DeleteMapping("/user/withdraw")
//    public ResponseEntity<?> withdrawUser(
//            @AuthenticationPrincipal OAuth2User oauth2User,
//            HttpServletResponse response) {
//        String email = oauth2User.getAttribute("email");
//        userRepository.deleteByEmail(email);
//
//        // 쿠키 제거 (로그아웃과 동일)
//        Cookie accessToken = new Cookie("access_token", "");
//        Cookie refreshToken = new Cookie("refresh_token", "");
//        accessToken.setMaxAge(0);
//        refreshToken.setMaxAge(0);
//        accessToken.setPath("/");
//        refreshToken.setPath("/");
//        response.addCookie(accessToken);
//        response.addCookie(refreshToken);
//
//        return ResponseEntity.ok().body("Account successfully deleted");
//    }
//}