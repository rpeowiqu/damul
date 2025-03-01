package com.damul.api.admin.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserUpdate {
    private String email;
    private String profileImageUrl;
    private String nickname;
    private int reportCount;
    private boolean active;
}
