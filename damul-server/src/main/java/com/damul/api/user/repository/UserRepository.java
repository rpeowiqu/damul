package com.damul.api.user.repository;

import com.damul.api.admin.dto.response.AdminUserList;
import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.AccessRange;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.dto.response.SettingResponse;
import com.damul.api.user.dto.response.UserList;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // 닉네임 중복 확인
    boolean existsByNickname(String nickname);

    // 설정 조회
    Optional<User> findById(@Param("id") int userId);


    Optional<User> findByEmail(String email);

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
            "WHERE u.nickname =:nickname")
    UserList findUser(@Param("nickname") String nickname);

    // 사용자 검색
    @Query("SELECT new com.damul.api.user.dto.response.UserList(u.id, u.profileImageUrl, u.nickname) " +
            "FROM User u " +
            "WHERE u.nickname LIKE :startsWith " +
            "AND u.id > :cursor " +  // cursor 기반 페이징 추가
            "ORDER BY u.id")  // id로 2차 정렬 추가
    List<UserList> findByNicknameContainingWithPaging(@Param("startsWith") String startsWith,
                                                        @Param("cursor") int cursor,
                                                        Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
    int countActiveUsers();

    @Query("SELECT u.accessRange FROM User u WHERE u.id = :userId")
    AccessRange findAccessRangeById(@Param("userId") int userId);

    @Modifying
    @Query("UPDATE User u SET u.reportCount = u.reportCount + 1 WHERE u.id = :userId")
    void incrementReportCount(@Param("userId") int userId);

    @Query("""
        SELECT new com.damul.api.admin.dto.response.AdminUserList(
            u.id,
            u.nickname,
            u.email
        )
        FROM User u
        WHERE (:searchType = 'nickname' AND u.nickname LIKE %:keyword%)
            OR (:searchType = 'email' AND u.email LIKE %:keyword%)
            OR (:searchType IS NULL OR :searchType = '')
        """)
    Page<AdminUserList> findUsersWithSearch(
            @Param("searchType") String searchType,
            @Param("keyword") String keyword,
            Pageable pageable
    );

}
