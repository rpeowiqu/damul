package com.damul.api.mypage.repository;

import com.damul.api.mypage.entity.Bookmark;
import com.damul.api.recipe.dto.response.RecipeList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Integer> {
    @Query("""
    SELECT new com.damul.api.recipe.dto.response.RecipeList(
        b.recipe.id,
        b.recipe.title,
        b.recipe.thumbnailUrl,
        b.recipe.content,
        b.recipe.createdAt,
        b.recipe.user.id,
        b.recipe.user.nickname,
        b.recipe.viewCnt,
        b.recipe.likeCnt,
        true,
        CASE WHEN l.id IS NOT NULL THEN true ELSE false END
    )
    FROM Bookmark b
    LEFT JOIN RecipeLike l ON l.recipe.id = b.recipe.id AND l.user.id = :userId
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