package com.damul.api.auth.oauth2.dto;

import java.util.Map;

public class KaKaoResponse implements OAuth2Response {

    private final Map<String, Object> attribute;

    public KaKaoResponse(final Map<String, Object> attribute) {
        this.attribute = attribute;
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getProviderId() {
        return attribute.get("id").toString();
    }

    @Override
    public String getEmail() {
        Map<String, Object> account = (Map<String, Object>) attribute.get("kakao_account");
        return (String) account.get("email");
    }

    @Override
    public String getProfileImage() {
        Map<String, Object> properties = (Map<String, Object>) attribute.get("properties");
        return (String) properties.get("profile_image");
    }

    @Override
    public String getNickname() {
        Map<String, Object> properties = (Map<String, Object>) attribute.get("properties");
        return (String) properties.get("nickname");
    }
}
