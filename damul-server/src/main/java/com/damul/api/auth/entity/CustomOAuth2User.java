package com.damul.api.auth.entity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

public class CustomOAuth2User {
    private final User user;

    public CustomOAuth2User(User user) {
        this.user = user;
    }


}