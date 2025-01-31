package com.damul.api.auth.oauth2.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.io.Serializable;
import java.util.Map;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class NaverResponse implements OAuth2Response, Serializable {
    private String email;
    private String nickname;
    private String profileImage;
    private String providerId;

    @JsonIgnore
    public String getProvider() {
        return "naver";
    }

    public NaverResponse(Map<String, Object> attribute) {
        Map<String, Object> response = (Map<String, Object>) attribute.get("response");
        this.email = response != null ? (String) response.get("email") : null;
        this.nickname = response != null ? (String) response.get("nickname") : null;
        this.profileImage = response != null ? (String) response.get("profile_image") : null;
        this.providerId = response != null ? (String) response.get("id") : null;
    }
}