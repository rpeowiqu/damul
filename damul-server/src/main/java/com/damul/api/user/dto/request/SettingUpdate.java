package com.damul.api.user.dto.request;

import com.damul.api.auth.entity.type.AccessRange;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SettingUpdate {
    private String nickname;
    private String selfIntroduction;
    private String profileImageUrl;
    private String backgroundImageUrl;
    private AccessRange accessRange;
    private boolean warningEnabled;
    private boolean profileImageDefault;
    private boolean backgroundImageDefault;
}
