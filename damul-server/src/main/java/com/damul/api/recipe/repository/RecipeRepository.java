package com.damul.api.recipe.repository;

import com.damul.api.main.dto.response.RecipeTagList;
import com.damul.api.main.dto.response.SuggestedRecipeList;
import com.damul.api.mypage.dto.response.MyRecipeList;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.entity.Recipe;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {

    // 기본 조회 (정렬, 검색 조건 없음)
    @Query("""
            SELECT DISTINCT new com.damul.api.recipe.dto.response.RecipeList(
                r.id, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname, r.viewCnt, r.likeCnt,
                CASE WHEN b.id IS NOT NULL THEN true ELSE false END,
                CASE WHEN l.id IS NOT NULL THEN true ELSE false END)
            FROM Recipe r
            JOIN r.user u
            LEFT JOIN RecipeBookmark b ON b.recipe.id = r.id AND b.user.id = :currentUserId
            LEFT JOIN RecipeLike l ON l.recipe.id = r.id AND l.user.id = :currentUserId
            WHERE r.deleted = false
            AND (:cursor = 0 OR r.id < :cursor)
            ORDER BY r.id DESC
            """)
    List<RecipeList> findAllRecipes(
            @Param("cursor") int cursor,
            @Param("currentUserId") int currentUserId,
            Pageable pageable
    );

    // 검색 조건만 있는 경우
    @Query("""
            SELECT new com.damul.api.recipe.dto.response.RecipeList(
                r.id, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname, r.viewCnt, r.likeCnt,
                CASE WHEN b.id IS NOT NULL THEN true ELSE false END,
                CASE WHEN l.id IS NOT NULL THEN true ELSE false END)
            FROM Recipe r
            JOIN r.user u
            LEFT JOIN RecipeBookmark b ON b.recipe.id = r.id AND b.user.id = :currentUserId
            LEFT JOIN RecipeLike l ON l.recipe.id = r.id AND l.user.id = :currentUserId
            WHERE r.deleted = false
            AND (:cursor = 0 OR r.id < :cursor)
            AND (:searchType = 'author' AND u.nickname LIKE %:keyword%
                OR :searchType = 'content' AND (r.title LIKE %:keyword% OR r.content LIKE %:keyword%))
            ORDER BY r.id DESC
            """)
    List<RecipeList> findBySearch(
            @Param("cursor") int cursor,
            @Param("currentUserId") int currentUserId,
            Pageable pageable,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword
    );

    // 정렬 조건만 있는 경우
    @Query("""
            SELECT new com.damul.api.recipe.dto.response.RecipeList(
                r.id, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname, r.viewCnt, r.likeCnt,
                CASE WHEN b.id IS NOT NULL THEN true ELSE false END,
                CASE WHEN l.id IS NOT NULL THEN true ELSE false END)
            FROM Recipe r
            JOIN r.user u
            LEFT JOIN Recipe prev ON prev.id = :cursor
            LEFT JOIN RecipeBookmark b ON b.recipe.id = r.id AND b.user.id = :currentUserId
            LEFT JOIN RecipeLike l ON l.recipe.id = r.id AND l.user.id = :currentUserId
            WHERE r.deleted = false
            AND (:cursor = 0 OR 
                ((:orderBy = 'likes' AND (r.likeCnt < prev.likeCnt OR (r.likeCnt = prev.likeCnt AND r.id < prev.id)))
                OR (:orderBy = 'views' AND (r.viewCnt < prev.viewCnt OR (r.viewCnt = prev.viewCnt AND r.id < prev.id)))
                OR (:orderBy NOT IN ('likes', 'views') AND r.id < :cursor)))
            ORDER BY
            CASE 
                WHEN :orderBy = 'likes' THEN r.likeCnt
                WHEN :orderBy = 'views' THEN r.viewCnt
                ELSE r.id
            END DESC,
            r.id DESC
            """)
    List<RecipeList> findAllWithOrder(
            @Param("cursor") int cursor,
            @Param("currentUserId") int currentUserId,
            Pageable pageable,
            @Param("orderBy") String orderBy
    );

    // 검색 조건과 정렬 조건이 모두 있는 경우
    @Query("""
            SELECT new com.damul.api.recipe.dto.response.RecipeList(
                r.id, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname, r.viewCnt, r.likeCnt,
                CASE WHEN b.id IS NOT NULL THEN true ELSE false END,
                CASE WHEN l.id IS NOT NULL THEN true ELSE false END)
            FROM Recipe r
            JOIN r.user u
            LEFT JOIN Recipe prev ON prev.id = :cursor
            LEFT JOIN RecipeBookmark b ON b.recipe.id = r.id AND b.user.id = :currentUserId
            LEFT JOIN RecipeLike l ON l.recipe.id = r.id AND l.user.id = :currentUserId
            WHERE r.deleted = false
            AND (:cursor = 0 OR 
                ((:orderBy = 'likes' AND (r.likeCnt < prev.likeCnt OR (r.likeCnt = prev.likeCnt AND r.id < prev.id)))
                OR (:orderBy = 'views' AND (r.viewCnt < prev.viewCnt OR (r.viewCnt = prev.viewCnt AND r.id < prev.id)))
                OR (:orderBy NOT IN ('likes', 'views') AND r.id < :cursor)))
            AND (:searchType = 'author' AND u.nickname LIKE %:keyword%
                OR :searchType = 'content' AND (r.title LIKE %:keyword% OR r.content LIKE %:keyword%))
            ORDER BY
            CASE 
                WHEN :orderBy = 'likes' THEN r.likeCnt
                WHEN :orderBy = 'views' THEN r.viewCnt
                ELSE r.id
            END DESC,
            r.id DESC
            """)
    List<RecipeList> findBySearchWithOrder(
            @Param("cursor") int cursor,
            @Param("currentUserId") int currentUserId,
            Pageable pageable,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword,
            @Param("orderBy") String orderBy
    );

    // 레시피 상세조회 시 조회수증가
    @Modifying
    @Transactional
    @Query("UPDATE Recipe r SET r.viewCnt = :viewCount WHERE r.id = :recipeId")
    void updateViewCount(@Param("recipeId") int recipeId, @Param("viewCount") int viewCount);

    @Query("""
        SELECT new com.damul.api.recipe.dto.response.RecipeList(
            r.id,
            r.title,
            r.thumbnailUrl,
            r.content,
            r.createdAt,
            r.user.id,
            r.user.nickname,
            r.viewCnt,
            r.likeCnt,
            CASE WHEN b.id IS NOT NULL THEN true ELSE false END,
            CASE WHEN l.id IS NOT NULL THEN true ELSE false END
        )
        FROM Recipe r
        LEFT JOIN Bookmark b ON b.recipe.id = r.id AND b.user.id = :userId
        LEFT JOIN RecipeLike l ON l.recipe.id = r.id AND l.user.id = :userId
        WHERE r.user.id = :userId
        AND r.deleted = false
        AND (:cursor = 0 OR r.id < :cursor)
        ORDER BY r.id DESC
        LIMIT :size
    """)
    List<RecipeList> findMyRecipes(
            @Param("userId") int userId,
            @Param("cursor") int cursor,
            @Param("size") int size
    );

    @Query("""
    SELECT new com.damul.api.main.dto.response.SuggestedRecipeList(
        r.id, r.title, r.thumbnailUrl)
    FROM Recipe r
    JOIN RecipeLike rl ON r.id = rl.recipe.id
    WHERE rl.createdAt BETWEEN :startDate AND :endDate
    AND r.deleted = false
    GROUP BY r.id, r.title, r.thumbnailUrl
    ORDER BY COUNT(rl.id) DESC
    """)
    List<SuggestedRecipeList> findTop5LikedRecipes(@Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate,
                                                   Pageable pageable);

    @Query("""
    SELECT new com.damul.api.main.dto.response.RecipeTagList(t.id, t.tagName)
    FROM Tag t 
    JOIN RecipeTag rt ON t.id = rt.tag.id 
    WHERE rt.recipe.id = :recipeId
    """)
    List<RecipeTagList> findRecipeTagListByRecipeId(@Param("recipeId") Integer recipeId);


    boolean existsByUserIdAndIdLessThan(int userId, int id);


    @Modifying
    @Transactional
    @Query("UPDATE Recipe r SET r.deleted = true WHERE r.id = :recipeId")
    void softDeleteRecipe(@Param("recipeId") int recipeId);

    Optional<Recipe> findByIdAndDeletedFalse(int recipeId);

    @Query("""
    SELECT DISTINCT new com.damul.api.recipe.dto.response.RecipeList(
        r.id, r.title, r.thumbnailUrl, r.content, r.createdAt,
        r.user.id, r.user.nickname, r.viewCnt, r.likeCnt,
        false, false)
    FROM Recipe r
    JOIN r.user u
    JOIN RecipeIngredient ri ON ri.recipe.id = r.id
    LEFT JOIN UserIngredient ui ON ri.ingredientName = ui.ingredientName
        AND ui.userReciept.user.id = :userId
        AND ui.isDeleted = false
    WHERE r.deleted = false
    GROUP BY r.id, r.title, r.thumbnailUrl, r.content, r.createdAt,
             r.user.id, r.user.nickname, r.viewCnt, r.likeCnt
    HAVING COUNT(DISTINCT CASE WHEN ui.userIngredientId IS NOT NULL THEN ri.id END) > 0
    ORDER BY 
        CAST(COUNT(DISTINCT CASE WHEN ui.userIngredientId IS NOT NULL THEN ri.id END) AS float) 
        / CAST(COUNT(DISTINCT ri.id) AS float) DESC,
        r.likeCnt DESC, 
        r.viewCnt DESC
    """)
    List<RecipeList> findRecipesByIngredientSimilarity(@Param("userId") int userId);

    @Query("""
    SELECT DISTINCT new com.damul.api.recipe.dto.response.RecipeList(
        r.id, r.title, r.thumbnailUrl, r.content, r.createdAt,
        r.user.id, r.user.nickname, r.viewCnt, r.likeCnt,
        false, false)
    FROM Recipe r
    WHERE r.deleted = false
    ORDER BY r.likeCnt DESC, r.viewCnt DESC
    """)
    List<RecipeList> findPopularRecipes();

    int countByUser_IdAndDeletedFalse(Integer authorId);

}

