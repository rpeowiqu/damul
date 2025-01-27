package com.damul.api.auth.oauth2.service;

import com.damul.api.auth.oauth2.dto.GoogleResponse;
import com.damul.api.auth.oauth2.dto.KaKaoResponse;
import com.damul.api.auth.oauth2.dto.NaverResponse;
import com.damul.api.auth.oauth2.dto.OAuth2Response;
import com.damul.api.damulserver.auth.entity.User;
import com.damul.api.damulserver.auth.entity.type.Provider;
import com.damul.api.damulserver.auth.entity.type.Role;
import com.damul.api.damulserver.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("OAuth2 연결");
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // OAuth2 제공자 ID 추출(google, naver, kakao)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.info("registrationId: {}", registrationId);

        OAuth2Response oAuth2Response = null;

        if(registrationId.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if(registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else if(registrationId.equals("kakao")) {
            oAuth2Response = new KaKaoResponse(oAuth2User.getAttributes());
        } else return null;


        return oAuth2User;
    }

    public void registerUser(OAuth2User oAuth2User) {
        // OAuth2 유저 정보에서 이메일과 이름 추출
        String email = oAuth2User.getAttribute("email");
        String nickname = oAuth2User.getAttribute("nickname");
        String profileImageUrl = oAuth2User.getAttribute("profile_image_url");
        String providerName = oAuth2User.getAttribute("provider");
        Provider provider = Provider.valueOf(providerName.toUpperCase());
        // 이메일로 기존 유저 확인 후 없으면 새로 등록
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .nickname(nickname)
                    .email(email)
                    .profileImageUrl(profileImageUrl)
                    .provider(provider)  // 기본 provider 설정
                    .role(Role.USER)           // 기본 role 설정
                    .build();
            userRepository.save(user);
        }
    }

}
