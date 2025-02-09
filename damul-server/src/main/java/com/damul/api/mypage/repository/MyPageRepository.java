package com.damul.api.mypage.repository;

import com.damul.api.mypage.dto.response.BadgeList;
import com.damul.api.mypage.dto.response.FoodPreferenceList;
import com.damul.api.mypage.entity.FoodPreference;
import com.damul.api.mypage.entity.UserBadge;
import com.damul.api.recipe.dto.response.RecipeList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MyPageRepository extends JpaRepository<FoodPreference, Integer> {

    @Query("""
            SELECT new com.damul.api.mypage.dto.response.FoodPreferenceList(
                fp.category.id,
                fp.category.categoryName,
                fp.categoryPreference
            )
            FROM FoodPreference fp
            WHERE fp.user.id = :userId
            """)
    List<FoodPreferenceList> findPreferencesByUserId(@Param("userId") int userId);

    @Query("""
            SELECT new com.damul.api.mypage.dto.response.BadgeList(
                ub.badge.id,
                ub.badge.name,
                ub.level
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
            AND ub.level > :userLevel
            """)
    int countUsersWithHigherLevel(@Param("badgeId") int badgeId, @Param("userLevel") int userLevel);

    @Query("""
        SELECT new com.damul.api.recipe.dto.response.RecipeList(
            b.recipe.id,
            b.recipe.title,
            b.recipe.thumbnailUrl,
            b.recipe.content,
            b.recipe.createdAt,
            b.recipe.user.id,
            b.recipe.user.nickname
        )
        FROM Bookmark b
        WHERE b.user.id = :userId
        AND b.recipe.deleted = false
        AND (:cursor = 0 OR b.id < :cursor)
        ORDER BY b.id DESC
        LIMIT :size
        """)
    List<RecipeList> findBookmarkedRecipes(
            @Param("userId") int userId,
            @Param("cursor") int cursor,
            @Param("size") int size
    );

    boolean existsByUserIdAndIdLessThan(int userId, int id);

}
