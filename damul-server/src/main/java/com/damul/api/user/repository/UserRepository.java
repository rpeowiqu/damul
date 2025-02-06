package com.damul.api.user.repository;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.dto.response.SettingResponse;
import com.damul.api.user.dto.response.UserList;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Integer> {

    // 닉네임 중복 확인
    boolean existsByNickname(String nickname);

    // 설정 조회
    Optional<User> findById(@Param("id") int userId);

    // 설정 수정
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.nickname = :#{#settingUpdate.nickname}, " +
            "u.selfIntroduction = :#{#settingUpdate.selfIntroduction}, " +
            "u.profileImageUrl = :#{#settingUpdate.profileImageUrl}, " +
            "u.profileBackgroundImageUrl = :#{#settingUpdate.profileBackgroundImageUrl}, " +
            "u.accessRange = :#{#settingUpdate.accessRange}, " +
            "u.warningEnabled = :#{#settingUpdate.warningEnabled} " +
            "WHERE u.id = :userId")
    void updateUserSettings(@Param("userId") int userId, @Param("settingUpdate")SettingUpdate settingUpdate);

    // ADMIN으로 조회
    Optional<User> findByRole(Role role);

    // 사용자 조회
    @Query("SELECT new com.damul.api.user.dto.response.UserList(u.id, u.profileImageUrl, u.nickname) " +
            "FROM User u " +
            "WHERE u.id > :cursorId " +
            "ORDER BY u.id LIMIT :size")
    List<UserList> findUserAll(@Param("cursorId") int cursorId,
                               @Param("size") int size);

    // 사용자 검색
    @Query("SELECT new com.damul.api.user.dto.response.UserList(u.id, u.profileImageUrl, u.nickname) " +
            "FROM User u " +
            "WHERE u.nickname LIKE %:keyword% " +
            "AND u.id > :cursorId " +
            "ORDER BY u.id LIMIT :size")
    List<UserList> findUserByNickname(@Param("cursorId") int cursorId,
                                      @Param("size") int size,
                                      @Param("keyword") String keyword);
}
