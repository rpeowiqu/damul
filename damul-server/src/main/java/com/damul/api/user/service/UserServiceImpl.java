package com.damul.api.user.service;

import com.damul.api.auth.entity.User;
import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.dto.response.SettingResponse;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    // 닉네임 중복 확인
    @Override
    public boolean checkNicknameDuplication(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    // 설정 조회
    @Override
    public SettingResponse getSetting() {
        return null;
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


    

    
    
    // 팔로워 목록 조회
}
