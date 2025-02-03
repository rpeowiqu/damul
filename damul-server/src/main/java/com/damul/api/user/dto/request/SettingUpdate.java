package com.damul.api.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingUpdate {
    private int userId;
    private String nickname;
    private String selfIntroduction;
    private String profileImageUrl;
    private String profileBackgroundImageUrl;
    private boolean fridgeVisible;
    private boolean warningEnabled;
}
