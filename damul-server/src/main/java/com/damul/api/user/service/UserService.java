package com.damul.api.user.service;

import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.dto.response.SettingResponse;
import com.damul.api.user.dto.response.UserList;

public interface UserService {
    // 닉네임 중복확인
    boolean checkNicknameDuplication(String email);

    // 설정 조회
    SettingResponse getSetting(int userId);

    // 설정 수정
    void updateSetting(int userId, SettingUpdate setting);

    // 사용자 목록 조회 및 검색
    ScrollResponse<UserList> getSearchUserList(ScrollRequest scrollRequest, String keyword);
}
