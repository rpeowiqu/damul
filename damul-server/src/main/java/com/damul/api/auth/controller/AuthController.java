package com.damul.api.auth.controller;

import com.damul.api.auth.dto.TermsResponse;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.repository.TermsRepository;
import com.damul.api.auth.repository.UserRepository;
import com.damul.api.auth.service.AuthService;
import com.damul.api.auth.util.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    private final TermsRepository termsRepository;

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
    public ResponseEntity<?> signup(HttpServletRequest request, HttpServletResponse response) {
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

    // 약관 동의 조회
    @GetMapping("/terms")
    public ResponseEntity<?> getTerms(@CookieValue(name="temp_token", required = true) String tempToken) {

        log.info("약관 동의 조회 요청");

        // 임시토큰 검증
        if(!jwtTokenProvider.validateToken(tempToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "유효하지 않은 토큰입니다."));
        }

        // 약관 데이터 조회
        log.info("약관 데이터 조회 시작");
        List<TermsResponse> terms = termsRepository.findAll();
        if(terms.size() == 0 || terms.isEmpty()) {
            log.info("약관 데이터 조회 성공 - 데이터 없음");
            return ResponseEntity.noContent().build();
        }

        log.info("약관 데이터 조회 성공, size: {}", terms.size());

        return ResponseEntity.ok().body(terms);
    }
}