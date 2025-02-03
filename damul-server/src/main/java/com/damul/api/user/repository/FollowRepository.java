package com.damul.api.user.repository;

import com.damul.api.auth.entity.User;
import com.damul.api.user.dto.response.UserList;
import com.damul.api.user.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Integer> {
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    // 커서 기반 팔로워 목록 조회
    // 나를 팔로우하는 사람들 목록 (팔로워 목록)
    @Query("SELECT f.follower FROM Follow f " +
            "WHERE f.following.id = :userId " +
            "AND f.id > :cursorId " +
            "ORDER BY f.id " +
            "LIMIT :size")
    List<UserList> findFollowersByUserIdAndCursorId(@Param("userId") int userId,
                                                     @Param("cursorId") int cursorId,
                                                     @Param("size") int size);
    // 내가 팔로우하는 사람들 목록 (팔로잉 목록)
    @Query("SELECT f.following FROM Follow f " +
            "WHERE f.follower.id = :userId " +
            "AND f.id > :cursorId " +
            "ORDER BY f.id " +
            "LIMIT :size")
    List<UserList> findFollowingsByUserIdAndCursorId(@Param("userId") int userId,
                                                @Param("cursorId") int cursorId,
                                                @Param("size") int size);
}
