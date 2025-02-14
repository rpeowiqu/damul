package com.damul.api.user.repository;

import com.damul.api.auth.entity.User;
import com.damul.api.user.dto.response.FollowList;
import com.damul.api.user.entity.Follow;
import org.springframework.data.domain.Pageable;
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
    @Query("""
            SELECT new com.damul.api.user.dto.response.FollowList(
                f.id,
                f.follower.id,
                f.follower.profileImageUrl,
                f.follower.nickname)
            FROM Follow f
            WHERE f.following.id = :followingId
            AND (:cursor = 0 OR f.id < :cursor)
            ORDER BY f.id DESC
            """)
    List<FollowList> findFollowersByUserIdAndCursorId(@Param("followingId") int followingId,
                                                      @Param("cursor") int cursor,
                                                      Pageable pageable);

    // 팔로워목록 - 검색
    @Query("""
    SELECT new com.damul.api.user.dto.response.FollowList(
        f.id,
        f.follower.id,
        f.follower.profileImageUrl,
        f.follower.nickname)
    FROM Follow f
    WHERE f.following.id = :followingId
    AND (:cursor = 0 OR f.id < :cursor)
    AND f.follower.nickname LIKE :contains
    ORDER BY CASE 
            WHEN f.follower.nickname = :exactMatch THEN 0
            WHEN f.follower.nickname LIKE :startsWith THEN 1
            ELSE 2
        END, f.id DESC
    """)
    List<FollowList> findFollowerByUserIdAndCursorIdAndNickname(@Param("followingId") int followingId,
                                                              @Param("contains") String contains,
                                                              @Param("exactMatch") String exactMatch,
                                                              @Param("startsWith") String startsWith,
                                                              @Param("cursor") int cursor,
                                                              Pageable pageable);


    // 내가 팔로우하는 사람들 목록 (팔로잉 목록)
    @Query("""
            SELECT new com.damul.api.user.dto.response.FollowList(
                f.id,
                f.following.id,
                f.following.profileImageUrl,
                f.following.nickname)
            FROM Follow f
            WHERE f.follower.id = :followerId
            AND (:cursor = 0 OR f.id < :cursor)
            ORDER BY f.id DESC
            """)
    List<FollowList> findFollowingsByUserIdAndCursorId(@Param("followerId") int followerId,
                                                        @Param("cursor") int cursor,
                                                        Pageable pageable);


    // 팔로잉 목록 - 닉네임 검색
    @Query("""
        SELECT new com.damul.api.user.dto.response.FollowList(
            f.id,
            f.following.id,
            f.following.profileImageUrl,
            f.following.nickname)
        FROM Follow f
        WHERE f.follower.id = :followerId
        AND (:cursor = 0 OR f.id < :cursor)
        AND f.following.nickname LIKE :contains
        ORDER BY CASE 
            WHEN f.following.nickname = :exactMatch THEN 0
            WHEN f.following.nickname LIKE :startsWith THEN 1
            ELSE 2
        END, f.id DESC
        """)
    List<FollowList> findFollowingsByUserIdAndCursorIdAndNickname(@Param("followerId") int followerId,
                                                                @Param("contains") String contains,
                                                                @Param("exactMatch") String exactMatch,
                                                                @Param("startsWith") String startsWith,
                                                                @Param("cursor") int cursor,
                                                                Pageable pageable);

    // 팔로우 관계를 확인
    Optional<Follow> findByFollower_IdAndFollowing_Id(@Param("followerId") int followerId,
                                               @Param("followingId") int followingId);

    // 팔로워 강제 삭제
    void deleteByFollower_IdAndFollowing_Id(@Param("followerId") int followerId,
                                            @Param("followingId") int followingId);

    int countByFollowingId(int userId);

    int countByFollowerId(int userId);

    boolean existsByFollowerIdAndFollowingId(int followerId, int followingId);

}
