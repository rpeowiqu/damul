package com.damul.api.mypage.repository;

import com.damul.api.mypage.dto.response.BadgeList;
import com.damul.api.mypage.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Integer> {
    @Query("""
            SELECT new com.damul.api.mypage.dto.response.BadgeList(
                ub.badge.id,
                ub.badge.title,
                ub.badge.level
            )
            FROM UserBadge ub
            WHERE ub.user.id = :userId
            """)
    List<BadgeList> findBadgesByUserId(@Param("userId") int userId);

    Optional<UserBadge> findByUserIdAndBadgeId(int userId, int badgeId);

    @Query("""
            SELECT COUNT(DISTINCT ub.user.id)
            FROM UserBadge ub
            WHERE ub.badge.id = :badgeId
            AND ub.badge.level > :userLevel
            """)
    int countUsersWithHigherLevel(@Param("badgeId") int badgeId, @Param("userLevel") int userLevel);
}

