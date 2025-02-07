package com.damul.api.common.user;

import com.damul.api.auth.dto.response.UserInfo;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;


import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements OAuth2User {
    private final UserInfo userInfo;
    private final Map<String, Object> attributes;

    @Override
    public String getName() {
        return userInfo.getNickname();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (userInfo == null) {
            return Collections.emptyList();
        }
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_USER")
        );
    }

    public int getId() {
        return userInfo.getId();
    }

    public String getEmail() { return userInfo.getEmail(); }

    public String getNickname() {
        return userInfo.getNickname();
    }
}