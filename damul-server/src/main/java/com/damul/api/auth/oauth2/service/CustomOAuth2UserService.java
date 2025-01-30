package com.damul.api.auth.oauth2.service;

import com.damul.api.auth.oauth2.dto.GoogleResponse;
import com.damul.api.auth.oauth2.dto.KaKaoResponse;
import com.damul.api.auth.oauth2.dto.NaverResponse;
import com.damul.api.auth.oauth2.dto.OAuth2Response;
import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Provider;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Duration;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // OAuth2 제공자 ID 추출(google, naver, kakao)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response = getOAuth2Response(registrationId, oAuth2User.getAttributes());

        // 기존 회원인지 확인
        Optional<User> existingUser = userRepository.findByEmail(oAuth2Response.getEmail());

        if (existingUser.isEmpty()) {
            log.info("새로운 회원입니다.");
            // 미가입 사용자인 경우 Redis에 OAuth2 정보를 저장
            // 현재 세션 ID를 키로 사용
            String sessionKey = "oauth2:user:" + RequestContextHolder.currentRequestAttributes().getSessionId();

            // Map으로 변환하여 저장 -> 직렬화 문제 방지
            try {
                Map<String, String> oauth2Info = Map.of(
                        "email", oAuth2Response.getEmail(),
                        "nickname", oAuth2Response.getNickname(),
                        "profileImage", oAuth2Response.getProfileImage(),
                        "providerId", oAuth2Response.getProviderId(),
                        "provider", oAuth2Response.getProvider()
                );

                // Map을 JSON 문자열로 변환
                String jsonString = objectMapper.writeValueAsString(oauth2Info);
                redisTemplate.opsForValue().set(sessionKey, jsonString, Duration.ofMinutes(30));
            } catch (Exception e) {
                log.error("Redis 저장 중 오류 발생", e);
                throw new OAuth2AuthenticationException(
                        new OAuth2Error("server_error"),
                        "서버 오류가 발생했습니다."
                );
            }

            throw new OAuth2AuthenticationException(
                    new OAuth2Error("terms_agreement_required"),
                    "약관 동의가 필요합니다."
            );
        }

        // 기존 로직 유지
        log.info("기존 유저입니다.");
        User user = existingUser.get();
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRole().name())),
                oAuth2User.getAttributes(),
                userRequest.getClientRegistration().getProviderDetails()
                        .getUserInfoEndpoint().getUserNameAttributeName()
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
