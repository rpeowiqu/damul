package com.damul.api.auth.controller;

import com.damul.api.auth.dto.SignupRequest;
import com.damul.api.auth.dto.TermsResponse;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.repository.TermsRepository;
import com.damul.api.auth.repository.AuthRepository;
import com.damul.api.auth.service.AuthService;
import com.damul.api.auth.util.CookieUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            // 액세스 토큰 추출
            String accessToken = cookieUtil.getCookie(request, "access_token")
                    .map(Cookie::getValue)
                    .orElse(null);

            if (accessToken != null) {
                // 토큰에서 이메일 추출
                String email = jwtTokenProvider.getUserEmailFromToken(accessToken);

                // Redis에서 리프레시 토큰 제거
                authService.removeRefreshToken(email);
            }

            // 쿠키 삭제
            cookieUtil.deleteCookie(response, "access_token");
            cookieUtil.deleteCookie(response, "refresh_token");

            // Spring Security 로그아웃
            SecurityContextHolder.clearContext();

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
            // 임시 토큰 검증
            if(!jwtTokenProvider.validateToken(tempToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "유효하지 않은 토큰입니다."));
            }

            // 토큰에서 정보 가지고 오기
            Claims claims = jwtTokenProvider.getClaims(tempToken);
            String email = claims.get("email", String.class);

            // 회원가입 시작
            log.info("회원가입 요청 - email: {}", email);
            Map<String, String> tokens = authService.processSignup(tempToken, signupRequest.getNickname());

            log.info("쿠키 설정");
            cookieUtil.addCookie(response, "access_token", tokens.get("accessToken"),
                    (int) jwtTokenProvider.getAccessTokenExpire() / 1000);
            cookieUtil.addCookie(response, "refresh_token", tokens.get("refreshToken"),
                    (int) jwtTokenProvider.getRefreshTokenExpire() / 1000);

            // 임시 토큰 쿠키 삭제
            cookieUtil.deleteCookie(response, "temp_token");

            return ResponseEntity.ok().build();
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "회원가입 처리 중 오류가 발생했습니다."));
        }
    }

    // 약관 동의 조회
    @GetMapping("/terms")
    public ResponseEntity<?> getTerms(@CookieValue(name="temp_token", required = true) String tempToken) {
        log.info("약관 동의 조회 요청");
        log.info("닉네임 갖고오기");
        Claims claims = jwtTokenProvider.getClaims(tempToken);
        String defaultNickname = claims.get("nickname", String.class);

        log.info("닉네임 조회 - nickname: {}", defaultNickname);

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



       return ResponseEntity.ok(Map.of(
                "terms", terms,
                "defaultNickname", defaultNickname
        ));
    }
}