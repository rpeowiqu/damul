package com.damul.api.mypage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileHeaderDetail {

    private int userId;
    private String nickname;
    private String profileImageUrl;
    private String profileBackgroundImageUrl;

}
