package com.damul.api.user.service;

import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.dto.response.SettingResponse;

public interface UserService {
    // 닉네임 중복확인
    boolean checkNicknameDuplication(String email);

    // 설정 조회
    SettingResponse getSetting();

    // 설정 수정
    void updateSetting(int userId, SettingUpdate setting);

    // 팔로워 목록 조회

    // 팔로잉 목록 조회

}
