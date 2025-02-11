package com.damul.api.auth.service;

import com.damul.api.auth.dto.request.AdminLoginRequest;
import com.damul.api.auth.dto.request.SignupRequest;
import com.damul.api.auth.dto.response.UserConsent;
import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.dto.response.UserResponse;
import com.damul.api.auth.entity.Terms;
import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.jwt.TokenService;
import com.damul.api.auth.repository.AuthRepository;
import com.damul.api.auth.repository.TermsRepository;
import com.damul.api.auth.util.CookieUtil;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.user.repository.UserRepository;
import com.fasterxml.jackson.core.ErrorReportConfiguration;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.beans.factory.annotation.Value;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    @Value("${admin.password}")
    private String hashedAdminPassword;

    private final TokenService tokenService;
    private final AuthRepository authRepository;
    private final UserRepository userRepository;
    private final TermsRepository termsRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final CookieUtil cookieUtil;

    // 사용자 정보 조회
    public UserResponse getUser(UserInfo userInfo) {
        log.info("사용자 정보 조회 시작");
        if(userInfo == null) {
            log.error("userInfo null");
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }

        Optional<User> user = authRepository.findById(userInfo.getId());

        log.info("사용자 정보 조회 완료");
        UserResponse userResponse = user.map(u -> UserResponse.builder()
                .id(u.getId())
                .nickname(u.getNickname())
                .warningEnabled(u.isWarningEnabled())
                .build())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));

        return userResponse;
    }

    // 로그아웃
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            log.info("로그아웃 요청");
            Optional<Cookie> accessTokenCookie = cookieUtil.getCookie(request, "access_token");

            if (accessTokenCookie.isPresent()) {
                String accessToken = accessTokenCookie.get().getValue();
                String email = jwtTokenProvider.getUserEmailFromToken(accessToken);
                tokenService.removeRefreshToken(email);
            }

            cookieUtil.deleteCookie(response, "access_token");
            cookieUtil.deleteCookie(response, "refresh_token");
            SecurityContextHolder.clearContext();
        } catch (Exception e) {
            log.error("로그아웃 처리 중 오류 발생", e);
            throw new RuntimeException("로그아웃 처리 중 오류가 발생했습니다.", e);
        }
    }

    // 회원가입
    @Transactional
    public void signup(String tempToken, SignupRequest signupRequest, HttpServletResponse response) {
        // 1. 토큰 검증
        if(!jwtTokenProvider.validateToken(tempToken)) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }

        try {
            // 2. 임시 토큰에서 정보 추출
            Claims claims = jwtTokenProvider.getClaims(tempToken);
            String email = claims.get("email", String.class);
            log.info("이메일 - email: {}", email);

            // 3. Redis에서 유저 정보 가져오기
            String sessionKey = "oauth2:user:" + email;
            log.info("Redis 세션 키: {}", sessionKey);

            String jsonString = redisTemplate.opsForValue().get(sessionKey);
            log.info("Redis에서 가져온 JSON 문자열: {}", jsonString);

            if (jsonString == null) {
                throw new BusinessException(ErrorCode.USER_FORBIDDEN);
            }

            // 4. 유저 정보 파싱 및 저장
            User user = objectMapper.readValue(jsonString, User.class);
            user.setNickname(signupRequest.getNickname());
            user.setSelfIntroduction(signupRequest.getSelfIntroduction());

            User savedUser = authRepository.save(user);

            // 5. UserInfo 객체 생성
            UserInfo userInfo = UserInfo.builder()
                    .id(savedUser.getId())
                    .email(savedUser.getEmail())
                    .nickname(savedUser.getNickname())
                    .role(savedUser.getRole().name())
                    .build();

            // 5. 토큰 생성
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userInfo,
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority(savedUser.getRole().name()))
            );

            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

            // 6. Refresh Token Redis에 저장
            redisTemplate.opsForValue().set(
                    "RT:" + savedUser.getEmail(),
                    refreshToken,
                    jwtTokenProvider.getRefreshTokenExpire(),
                    TimeUnit.MILLISECONDS
            );

            // 7. 임시 OAuth 정보 삭제
            redisTemplate.delete(sessionKey);

            // 8. 쿠키 설정
            cookieUtil.addCookie(response, "access_token", accessToken,
                    (int) jwtTokenProvider.getAccessTokenExpire() / 1000);
            cookieUtil.addCookie(response, "refresh_token", refreshToken,
                    (int) jwtTokenProvider.getRefreshTokenExpire() / 1000);
            cookieUtil.deleteCookie(response, "temp_token");

        } catch (Exception e) {
            log.error("회원가입 처리 중 오류 발생", e);
            throw new RuntimeException("회원가입 처리 중 오류가 발생했습니다.", e);
        }
    }

    // 약관동의 및 이메일,닉네임 조회
    public UserConsent getConsent(String tempToken) {
        log.info("약관동의 및 이메일, 닉네임 조회 시작");
        if(!jwtTokenProvider.validateToken(tempToken)) {
            log.error("유효하지 않은 토큰입니다");
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        Claims claims = jwtTokenProvider.getClaims(tempToken);
        String defaultNickname = claims.get("nickname", String.class);
        String email = claims.get("email", String.class);


        log.info("닉네임 조회 - nickname: {}", defaultNickname);
        log.info("이메일 조회 - email: {}", email);

        List<Terms> terms = termsRepository.findAll();
        if(terms.isEmpty()) {
            log.error("약관 데이터가 없음");
            throw new RuntimeException("약관 데이터가 존재하지 않습니다.");
        }

        log.info("약관 데이터 조회 성공, size: {}", terms.size());
        return UserConsent.builder()
                .email(email)
                .nickname(defaultNickname)
                .terms(terms)
                .build();
    }

    public Map<String, String> generateTokens(Authentication authentication) {
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        // Refresh Token Redis에 저장
        String userEmail = authentication.getName(); // 이메일
        redisTemplate.opsForValue().set(
                "RT:" + userEmail,
                refreshToken,
                jwtTokenProvider.getRefreshTokenExpire(),
                TimeUnit.MILLISECONDS
        );

        return Map.of(
                "access_token", accessToken,
                "refresh_token", refreshToken
        );
    }


    // 관리자 로그인
    public void adminLogin(AdminLoginRequest request, HttpServletResponse response) {
        // 관리자 존재 확인
        User admin = userRepository.findByRole(Role.ADMIN)
                .orElseThrow(() -> new IllegalArgumentException("관리자 계정이 존재하지 않습니다."));

        // 비밀번호 검증
        if (!BCrypt.checkpw(request.getPassword(), hashedAdminPassword)) {
            throw new BusinessException(ErrorCode.ADMIN_FORBIDDEN);
        }

        // 인증 객체 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                admin.getEmail(),
                null,
                Collections.singletonList(new SimpleGrantedAuthority(Role.ADMIN.name()))
        );

        // 토큰 생성
        Map<String, String> tokens = generateTokens(authentication);

        // 쿠키 설정
        cookieUtil.addCookie(response, "access_token", tokens.get("accessToken"),
                (int) jwtTokenProvider.getAccessTokenExpire() / 1000);
        cookieUtil.addCookie(response, "refresh_token", tokens.get("refreshToken"),
                (int) jwtTokenProvider.getRefreshTokenExpire() / 1000);

        log.info("관리자 로그인 성공: {}", admin.getEmail());
    }
}