package com.damul.api.user.repository;

import com.damul.api.user.dto.request.CheckNicknameRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserRepository, Long> {

    // 닉네임 중복 확인
    boolean existsByNickname(String nickname);
}
