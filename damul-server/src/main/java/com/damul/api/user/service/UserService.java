package com.damul.api.user.service;

import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.dto.response.SettingResponse;
import com.damul.api.user.dto.response.UserList;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    // 닉네임 중복확인
    boolean checkNicknameDuplication(String email);

    // 설정 조회
    SettingResponse getSetting(int userId);

    // 설정 수정
    void updateUserSettings(int userId, SettingUpdate setting, MultipartFile profileImage,
                       MultipartFile backgroundImage);

    // 사용자 목록 조회 및 검색
    List<UserList> getSearchUserList(String keyword);
}
