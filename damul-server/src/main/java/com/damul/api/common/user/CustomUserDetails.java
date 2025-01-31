package com.damul.api.common.user;

import com.damul.api.auth.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

// auth/security/CustomUserDetails.java
@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements OAuth2User {
    private final User user;
    private Map<String, Object> attributes;

    public CustomUserDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    @Override
    public String getName() {
        return user.getEmail();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(user.getRole().name()));
    }

    // 계정 상태 체크 메소드 추가
    public boolean isActive() {
        return user.isActive();
    }

    // 필요한 다른 사용자 상태 체크 메소드들 추가 가능
    public boolean isWarned() {
        return user.isWarning();
    }

    public int getReportCount() {
        return user.getReportCount();
    }
}