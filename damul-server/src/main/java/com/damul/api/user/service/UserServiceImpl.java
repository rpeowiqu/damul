package com.damul.api.user.service;

import com.damul.api.auth.entity.User;
import com.damul.api.common.dto.request.ScrollRequest;
import com.damul.api.common.dto.response.CursorPageMetaInfo;
import com.damul.api.common.dto.response.ScrollResponse;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.dto.response.SettingResponse;
import com.damul.api.user.dto.response.UserList;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    // 닉네임 중복 확인
    @Override
    public boolean checkNicknameDuplication(String nickname) {
        log.info("닉네임 중복확인 시작 - nickname: {}", nickname);
        return userRepository.existsByNickname(nickname);
    }

    // 설정 조회
    @Override
    public SettingResponse getSetting(int userId) {
        log.info("설정 조회 시작 - userId: {}", userId);

        Optional<User> userOptional  = userRepository.findById(userId);
        if(userOptional.isPresent()) {
            User user = userOptional.get();
            SettingResponse settingResponse = SettingResponse.builder()
                    .userId(user.getId())
                    .nickname(user.getNickname())
                    .profileImageUrl(user.getProfileImageUrl())
                    .profileBackgroundImageUrl(user.getProfileBackgroundImageUrl())
                    .accessRange(user.getAccessRange().name())
                    .warningEnabled(user.isWarningEnabled())
                    .build();

            return settingResponse;
        } else {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
    }

    // 설정 수정
    @Override
    @Transactional
    public void updateSetting(int userId, SettingUpdate setting) {
        log.info("설정 수정 시작");
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.updateSettings(setting);
        log.info("설정 수정 완료");
    }

    // 사용자 목록 조회 및 검색
    @Override
    public ScrollResponse<UserList> getSearchUserList(ScrollRequest request, String keyword) {
        List<UserList> userList;

        if(keyword == null || keyword.isEmpty()) {
            log.info("검색어 없음 - 전체 조회 시작");
            userList = userRepository.findUserAll(request.getCursorId(), request.getSize()+1);
        } else {
            log.info("검색어 있음 - 검색어: {}", keyword);
            userList = userRepository.findUserByNickname(request.getCursorId(), request.getSize()+1, keyword);
        }

        boolean hasNextData = userList.size() > request.getSize();
        log.info("다음 데이터 존재 여부: {}", hasNextData);

        List<UserList> resultList = hasNextData
                ? userList.subList(0, request.getSize())
                : userList;

        int nextCursor = !resultList.isEmpty()
                ? resultList.get(resultList.size() - 1).getUserId()
                : request.getCursorId();


        return new ScrollResponse<>(
                resultList,
                new CursorPageMetaInfo(nextCursor, hasNextData)
        );
    }
}
