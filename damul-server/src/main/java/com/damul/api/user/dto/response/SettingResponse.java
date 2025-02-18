package com.damul.api.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingResponse {
    private String email;
    private String nickname;
    private String selfIntroduction;
    private String profileImageUrl;
    private String profileBackgroundImageUrl;
    private String accessRange;
    private boolean warningEnabled;
    private boolean profileImageDefault;
    private boolean backgroundImageDefault;
}
