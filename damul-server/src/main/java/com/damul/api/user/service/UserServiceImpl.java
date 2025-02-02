package com.damul.api.user.service;

import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    // 닉네임 중복 확인
    @Override
    public boolean checkNicknameDuplication(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
}
