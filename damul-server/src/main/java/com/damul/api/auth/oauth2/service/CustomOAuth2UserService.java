package com.damul.api.auth.oauth2.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.oauth2.dto.GoogleResponse;
import com.damul.api.auth.oauth2.dto.KaKaoResponse;
import com.damul.api.auth.oauth2.dto.NaverResponse;
import com.damul.api.auth.oauth2.dto.OAuth2Response;
import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Provider;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.repository.TermsRepository;
import com.damul.api.auth.repository.AuthRepository;
import com.damul.api.common.user.CustomUserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;

import java.time.Duration;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AuthRepository authRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final TermsRepository termsRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("CustomOAuth2UserService, loadUser 진입");
        OAuth2User oAuth2User = super.loadUser(userRequest);

        log.info("OAuth2ser Attributes: {}", oAuth2User.getAttributes());

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.info("Registration ID: {}", registrationId);

        OAuth2Response oAuth2Response = getOAuth2Response(registrationId, oAuth2User.getAttributes());
        log.info("OAuth2Response after mapping - email: {}", oAuth2Response.getEmail());

        Optional<User> existingUser = authRepository.findByEmail(oAuth2Response.getEmail());

        if (existingUser.isEmpty()) {
            log.info("CustomOAuth2UserService, 신규 회원입니다.");
            String sessionKey = "oauth2:user:" + oAuth2Response.getEmail(); // 이메일 기반 키 사용

            try {
                User user = User.builder()
                                .email(oAuth2Response.getEmail())
                                .nickname(oAuth2Response.getNickname())
                                .profileImageUrl(oAuth2Response.getProfileImage())
                                .provider(oAuth2Response.getProvider())
                                .role(Role.USER)
                                .build();

                log.info("Redis에 저장할 사용자 정보: {}", user);

                // Redis에 저장
                log.info("Redis에 저장 시작");
                String jsonString = objectMapper.writeValueAsString(user);
                log.info("직렬화된 JSON: {}", jsonString);
                redisTemplate.opsForValue().set(sessionKey, jsonString, Duration.ofMinutes(30));
                log.info("Redis에 저장 완료");

                Map<String, Object> signupInfo = new HashMap<>();
                signupInfo.put("email", user.getEmail());
                signupInfo.put("nickname", user.getNickname());

                log.info("임시토큰 발급");
                String tempToken = jwtTokenProvider.generateTempToken(signupInfo);
                log.info("임시토큰 발급 완료 - tempToken: {}", tempToken);


                // OAuth2User attributes용 정보 (claims 정보 + tempToken)
                Map<String, Object> attributes = new HashMap<>(signupInfo);  // claims 정보 복사
                attributes.put("tempToken", tempToken);  // tempToken 추가

                return new DefaultOAuth2User(
                        Collections.emptyList(),
                        attributes,
                        "email"
                );

            } catch (Exception e) {
                log.error("Redis 저장 중 오류 발생", e);
                throw new OAuth2AuthenticationException(
                        new OAuth2Error("server_error"),
                        "서버 오류가 발생했습니다."
                );
            }
        }

        log.info("기존 유저입니다.");
        User user = existingUser.get();
        log.info("User 객체 조회 완료: id={}, email={}, nickname={}, role={}",
                user.getId(), user.getEmail(), user.getNickname());

        UserInfo userInfo = new UserInfo(user.getId(), user.getEmail(), user.getNickname(), user.getRole().name());
        log.info("UserInfo 객체 생성 완료: id={}, email={}, nickname={}",
                user.getId(), user.getEmail(), user.getNickname());

        Map<String, Object> attributes = oAuth2User.getAttributes();
        log.info("OAuth2User attributes: {}", attributes);

        try {
            CustomUserDetails customUserDetails = new CustomUserDetails(userInfo, attributes);
            log.info("CustomUserDetails 생성 완료: id={}, email={}, nickname={}",
                    customUserDetails.getId(), customUserDetails.getEmail(), customUserDetails.getNickname());
            return customUserDetails;
        } catch (Exception e) {
            log.error("CustomUserDetails 생성 중 오류 발생", e);
            log.error("Exception type: {}", e.getClass().getName());
            log.error("Exception message: {}", e.getMessage());
            log.error("Stack trace: ", e);
            throw e;
        }
    }

    // User 새로 생성
    private User saveUser(String registrationId, OAuth2Response oAuth2Response) {
        User user = User.builder()
                .nickname(oAuth2Response.getNickname())
                .email(oAuth2Response.getEmail())
                .profileImageUrl(oAuth2Response.getProfileImage())
                .provider(Provider.valueOf(registrationId.toUpperCase()))
                .role(Role.USER)
                .build();

        return authRepository.save(user);
    }

    public OAuth2Response getOAuth2Response(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equals("naver")) {
            log.info("naver, ID: {}", registrationId);
            return new NaverResponse(attributes);
        } else if (registrationId.equals("google")) {
            log.info("google, ID: {}", registrationId);
            return new GoogleResponse(attributes);
        } else if (registrationId.equals("kakao")) {
            log.info("kakao, ID: {}", registrationId);
            return new KaKaoResponse(attributes);
        } else {
            throw new IllegalArgumentException("지원되지 않는 OAuth2입니다.: " + registrationId);
        }
    }
}
