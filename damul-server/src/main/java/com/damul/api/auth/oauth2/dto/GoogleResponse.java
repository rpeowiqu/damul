package com.damul.api.auth.oauth2.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;
import java.util.Map;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class GoogleResponse implements OAuth2Response, Serializable {
    private String email;
    private String nickname;
    private String profileImage;
    private String providerId;

    public String getProvider() {
        return "google";
    }

    public GoogleResponse(Map<String, Object> attribute) {
        this.email = attribute.get("email") != null ? attribute.get("email").toString() : null;
        this.nickname = attribute.get("name") != null ? attribute.get("name").toString() : null;
        this.profileImage = attribute.get("picture") != null ? attribute.get("picture").toString() : null;
        this.providerId = attribute.get("sub") != null ? attribute.get("sub").toString() : null;
    }
}