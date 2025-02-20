package com.damul.api.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDetail {
    private int id;
    private String email;
    private String profileImageUrl;
    private String nickname;
    private String selfIntroduction;
    private int reportCount;
    private boolean active;
}
