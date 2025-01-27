package com.damul.api.auth.controller;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Provider;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.oauth2.dto.OAuth2Response;
import com.damul.api.auth.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    // 로그인된 사용자 정보 조회
    @GetMapping("/user/info")
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");

        // Optional로 변경하여 더 안전하게 처리
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found with email: " + email
                ));

        // 약관 동의 여부 체크
        if (!user.isTermsAgreed()) {
            // 약관 동의가 되지 않은 경우 400 상태 코드 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message", "약관 동의가 필요합니다",
                            "needsTermsAgreement", true,
                            "email", email,
                            "redirectUrl", "/terms-agreement"
                    ));
        }

        return ResponseEntity.ok(user);
    }

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

    // 약관 동의

    @PostMapping("/terms-agreement")
    public ResponseEntity<?> agreeToTerms(HttpSession session) {
        // 세션에서 OAuth2 정보 가져오기
        String registrationId = (String) session.getAttribute("oauth2Registration");
        OAuth2Response oAuth2Response = (OAuth2Response) session.getAttribute("oauth2User");

        if (oAuth2Response == null) {
            return ResponseEntity.badRequest().body("OAuth2 정보를 찾을 수 없습니다.");
        }

        // 이메일 중복 체크 추가
        if (userRepository.findByEmail(oAuth2Response.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 가입된 이메일입니다.");
        }

        // 사용자 생성 및 저장
        User user = User.builder()
                .email(oAuth2Response.getEmail())
                .nickname(oAuth2Response.getNickname())
                .profileImageUrl(oAuth2Response.getProfileImage())
                .provider(Provider.valueOf(registrationId.toUpperCase()))
                .role(Role.USER)
                .termsAgreed(true)
                .build();

        userRepository.save(user);

        // 세션의 임시 데이터 삭제
        session.removeAttribute("oauth2Registration");
        session.removeAttribute("oauth2User");

        return ResponseEntity.ok().build();
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