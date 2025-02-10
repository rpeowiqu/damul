package com.damul.api.mypage.dto.response;

import com.damul.api.auth.entity.User;
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

    public static ProfileHeaderDetail from(User user) {
        return new ProfileHeaderDetail(
                user.getId(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getProfileBackgroundImageUrl()
        );
    }

}
