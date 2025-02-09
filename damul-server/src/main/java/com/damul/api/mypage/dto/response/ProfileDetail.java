package com.damul.api.mypage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDetail {

    private int followerCount;
    private int followingCount;
    private String selfIntroduction;
    private List<FoodPreferenceList> foodPreference;

}
