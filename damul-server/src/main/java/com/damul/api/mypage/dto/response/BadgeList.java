package com.damul.api.mypage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BadgeList {

    private int badgeId;
    private String badgeName;
    private int badgeLevel;

}
