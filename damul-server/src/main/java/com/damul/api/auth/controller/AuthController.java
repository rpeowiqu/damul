package com.damul.api.auth.controller;

import com.damul.api.auth.dto.request.AdminLoginRequest;
import com.damul.api.auth.dto.request.SignupRequest;
import com.damul.api.auth.dto.response.UserConsent;
import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.dto.response.UserResponse;
import com.damul.api.auth.entity.Terms;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.repository.TermsRepository;
import com.damul.api.auth.repository.AuthRepository;
import com.damul.api.auth.service.AuthService;
import com.damul.api.auth.util.CookieUtil;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
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
    private final AuthRepository authRepository;
    private final CookieUtil cookieUtil;
    private final TermsRepository termsRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 사용자 정보 조회
    @GetMapping("/users")
    public ResponseEntity<UserResponse> getUser(@CurrentUser UserInfo userInfo) {
        log.info("사용자 정보 조회 요청");
        UserResponse userResponse = authService.getUser(userInfo);
        log.info("사용자 정보 조회 완료");
        return ResponseEntity.ok(userResponse);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            authService.logout(request, response);
            return ResponseEntity.ok()
                    .body(Map.of(
                            "success", true,
                            "message", "로그아웃 되었습니다."
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "로그아웃 처리 중 오류가 발생했습니다."));
        }
    }

    // 약관 동의 후 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@CookieValue(name = "temp_token", required = true) String tempToken,
                                    @RequestBody SignupRequest signupRequest,
                                    HttpServletResponse response) {
        try {
            authService.signup(tempToken, signupRequest, response);
            return ResponseEntity.ok()
                    .body(Map.of("message", "회원가입이 완료되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("회원가입 처리 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "회원가입 처리 중 오류가 발생했습니다."));
        }
    }

    // 약관 동의 및 닉네임, 이메일 조회
    @GetMapping("/consent")
    @Transactional(readOnly = true)
    public ResponseEntity<UserConsent> getTerms(@CookieValue(name="temp_token", required = true) String tempToken) {
        log.info("약관 동의 조회 요청");
        UserConsent consent = authService.getConsent(tempToken);
        log.info("약관 동의 조회 요청 - Email: {}, Nickname: {}, Terms Count: {}",
                consent.getEmail(),
                consent.getNickname(),
                consent.getTerms().size()
        );

        return ResponseEntity.ok().body(consent);
    }

    // 관리자 로그인
    @PostMapping("/admin/login")
    public ResponseEntity adminLogin(@RequestBody AdminLoginRequest request, HttpServletResponse response) {
        log.info("관리자 로그인 요청");
        try {
            log.info("관리자 로그인 요청");
            authService.adminLogin(request, response);
            return ResponseEntity.ok()
                    .body(Map.of("message", "관리자 로그인 성공"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "인증에 실패했습니다."));
        } catch (Exception e) {
            log.error("관리자 로그인 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "로그인 처리 중 오류가 발생했습니다."));
        }
    }
}