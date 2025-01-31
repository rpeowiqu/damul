package com.damul.api.common.user;

import com.damul.api.auth.dto.UserInfo;
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
    private final UserInfo userInfo;     // id와 nickname만 포함된 UserInfo
    private final Map<String, Object> attributes;


    @Override
    public String getName() {
        return userInfo.getNickname();  // email 대신 nickname 반환
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 기본 권한 ROLE_USER 부여
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
    }

    // UserInfo에서는 id와 nickname만 접근 가능
    public int getId() {
        return userInfo.getId();
    }

    public String getNickname() {
        return userInfo.getNickname();
    }
}