package com.damul.api.auth.oauth2.dto;

import com.damul.api.auth.entity.type.Provider;

public interface OAuth2Response {
    // 제공자 (naver, google, kakao)
    Provider getProvider();

    // 제공자에서 발급해주는 아이디(번호)
    String getProviderId();

    // 이메일
    String getEmail();

    // 프로필 사진
    String getProfileImage();

    // 닉네임
    String getNickname();
}