package com.damul.api.auth.oauth2.service;

import com.damul.api.auth.dto.TermsList;
import com.damul.api.auth.dto.UserInfo;
import com.damul.api.auth.jwt.JwtTokenProvider;
import com.damul.api.auth.oauth2.dto.GoogleResponse;
import com.damul.api.auth.oauth2.dto.KaKaoResponse;
import com.damul.api.auth.oauth2.dto.NaverResponse;
import com.damul.api.auth.oauth2.dto.OAuth2Response;
import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Provider;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.repository.TermsRepository;
import com.damul.api.auth.repository.UserRepository;
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

    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final TermsRepository termsRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("CustomOAuth2UserService, loadUser 진입");
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = getOAuth2Response(registrationId, oAuth2User.getAttributes());

        Optional<UserInfo> existingUser = userRepository.findByEmail(oAuth2Response.getEmail());

        if (existingUser.isEmpty()) {
            log.info("CustomOAuth2UserService, 신규 회원입니다.");
            String sessionKey = "oauth2:user:" + RequestContextHolder.currentRequestAttributes().getSessionId();

            try {
                User user = User.builder()
                                .email(oAuth2Response.getEmail())
                                .nickname(oAuth2Response.getNickname())
                                .profileImageUrl(oAuth2Response.getProfileImage())
                                .provider(oAuth2Response.getProvider())
                                .role(Role.USER)
                                .build();

                // Redis에 저장
                String jsonString = objectMapper.writeValueAsString(user);
                redisTemplate.opsForValue().set(sessionKey, jsonString, Duration.ofMinutes(30));

                // 약관 조회
                List<TermsList> terms = termsRepository.findAll();

                Map<String, Object> signupInfo = new HashMap<>();
                signupInfo.put("email", user.getEmail());
                signupInfo.put("nickname", user.getNickname());
                signupInfo.put("terms", terms);

                String tempToken = jwtTokenProvider.generateTempToken(signupInfo);

                return new DefaultOAuth2User(
                        Collections.emptyList(),
                        Map.of("tempToken", tempToken),
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
        UserInfo userInfo = existingUser.get();

        // DefaultOAuth2User 대신 CustomUserDetails 반환
        return new CustomUserDetails(
                userInfo,
                oAuth2User.getAttributes()
        );
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

        return userRepository.save(user);
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
