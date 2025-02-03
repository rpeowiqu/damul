package com.damul.api.user.repository;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.user.dto.request.SettingUpdate;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Integer> {

    // 닉네임 중복 확인
    boolean existsByNickname(String nickname);

    // 설정 수정
    void updateUserSettings(@Param("userId") int userId, @Param("dto")SettingUpdate settingUpdate);

    Optional<User> findByRole(Role role);
}
