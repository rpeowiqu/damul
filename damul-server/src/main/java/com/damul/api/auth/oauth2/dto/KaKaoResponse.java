package com.damul.api.auth.oauth2.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.io.Serializable;
import java.util.Map;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class KaKaoResponse implements OAuth2Response, Serializable {
    private String email;
    private String nickname;
    private String profileImage;
    private String providerId;

    @JsonIgnore
    public String getProvider() {
        return "kakao";
    }

    public KaKaoResponse(Map<String, Object> attribute) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attribute.get("kakao_account");
        Map<String, Object> properties = (Map<String, Object>) attribute.get("properties");

        this.email = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;
        this.nickname = properties != null ? (String) properties.get("nickname") : null;
        this.profileImage = properties != null ? (String) properties.get("profile_image") : null;
        this.providerId = attribute != null ? attribute.get("id").toString() : null;
    }

}