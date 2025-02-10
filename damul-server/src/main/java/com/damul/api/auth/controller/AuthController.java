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
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    public ResponseEntity<?> signup(@CookieValue(name = "tempToken", required = true) String tempToken,
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
    public ResponseEntity<?> getTerms(@CookieValue(name="temp_token", required = true) String tempToken) {
        log.info("약관 동의 조회 요청");

        // temp_token null이면 클라이언트가 인증되지 않은 상태일 수 있음
        if (tempToken == null) {
            log.error("tempToken 존재하지 않습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "인증 토큰이 없습니다."));
        }

        log.info("닉네임 갖고오기");
        Claims claims = jwtTokenProvider.getClaims(tempToken);
        String defaultNickname = claims.get("nickname", String.class);
        String email = claims.get("email", String.class);

        log.info("닉네임 조회 - nickname: {}", defaultNickname);
        log.info("이메일 조회 - email: {}", email);

        // 임시토큰 검증
        if(!jwtTokenProvider.validateToken(tempToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "유효하지 않은 토큰입니다."));
        }

        // 약관 데이터 조회
        log.info("약관 데이터 조회 시작");
        List<Terms> terms = termsRepository.findAll();
        if(terms.size() == 0 || terms.isEmpty()) {
            log.info("약관 데이터 조회 성공 - 데이터 없음");
            return ResponseEntity.noContent().build();
        }

        log.info("약관 데이터 조회 성공, size: {}", terms.size());
        UserConsent consent = UserConsent.builder()
                .email(email)
                .nickname(defaultNickname)
                .terms(terms)
                .build();


       return ResponseEntity.ok(consent);
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