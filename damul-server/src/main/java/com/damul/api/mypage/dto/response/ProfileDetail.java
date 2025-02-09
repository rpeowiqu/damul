package com.damul.api.mypage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDetail {

    private int followerCount;
    private int followingCount;
    private String selfIntroduction;
    private List<FoodPreferenceList> foodPreference;

}
