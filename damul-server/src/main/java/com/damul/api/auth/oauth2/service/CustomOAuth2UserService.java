package com.damul.api.auth.oauth2.service;

import com.damul.api.auth.oauth2.dto.GoogleResponse;
import com.damul.api.auth.oauth2.dto.KaKaoResponse;
import com.damul.api.auth.oauth2.dto.NaverResponse;
import com.damul.api.auth.oauth2.dto.OAuth2Response;
import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Provider;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.auth.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

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

        OAuth2Response oAuth2Response = getOAuth2Response(registrationId, oAuth2User.getAttributes());

        log.info("이메일 확인 : {}", oAuth2Response.getEmail());

        // 기존 회원인지 확인
        Optional<User> existingUser = userRepository.findByEmail(oAuth2Response.getEmail());
        log.info("기존 사용자 존재 여부: {}", existingUser.isPresent());

        if (existingUser.isEmpty()) {
            // 미가입 사용자인 경우 임시로 OAuth2 정보를 세션에 저장
            HttpSession session = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                    .getRequest().getSession();
            session.setAttribute("oauth2Registration", registrationId);
            session.setAttribute("oauth2User", oAuth2Response);

            // 예외발생
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("terms_agreement_required"),
                    "약관 동의가 필요합니다."
            );
        }

        User user = existingUser.get();
        return new DefaultOAuth2User(
                // 첫 번째 매개변수: 사용자의 권한 정보 설정
                // SimpleGrantedAuthority 객체로 권한 정보를 생성하고, Collections.singleton()로 단일 권한을 가진 Set을 생성
                Collections.singleton(new SimpleGrantedAuthority(user.getRole().name())),
                // 두 번째 매개변수: OAuth2 제공자로부터 받은 원본 사용자 정보
                // 이 정보는 나중에 필요할 때 사용할 수 있도록 저장됨
                oAuth2User.getAttributes(),
                // 세 번째 매개변수: 사용자를 식별할 수 있는 속성의 이름
                // application.yml에 설정된 user-name-attribute 값을 사용
                // 예: 구글은 'sub', 네이버는 'response', 카카오는 'id'
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

    private OAuth2Response getOAuth2Response(String registrationId, Map<String, Object> attributes) {
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
