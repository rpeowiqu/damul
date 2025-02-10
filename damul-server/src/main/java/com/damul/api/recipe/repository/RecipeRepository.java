package com.damul.api.recipe.repository;

import com.damul.api.mypage.dto.response.MyRecipeList;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.entity.Recipe;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {

    // 기본 조회 (정렬, 검색 조건 없음)
    @Query("""
            SELECT DISTINCT new com.damul.api.recipe.dto.response.RecipeList(
                r.id, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname)
            FROM Recipe r
            JOIN r.user u
            WHERE r.deleted = false
            AND (:cursor = 0 OR r.id < :cursor)
            ORDER BY r.id DESC
            """)
    List<RecipeList> findAllRecipes(
            @Param("cursor") int cursor,
            Pageable pageable
    );

    // 검색 조건만 있는 경우
    @Query("""
            SELECT new com.damul.api.recipe.dto.response.RecipeList(
                r.id, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname)
            FROM Recipe r
            JOIN r.user u
            WHERE r.deleted = false
            AND (:cursor = 0 OR r.id < :cursor)
            AND (:searchType = 'author' AND u.nickname LIKE %:keyword%
                OR :searchType = 'content' AND (r.title LIKE %:keyword% OR r.content LIKE %:keyword%))
            ORDER BY r.id DESC
            LIMIT :size
            """)
    List<RecipeList> findBySearch(
            @Param("cursor") int cursor,
            Pageable pageable,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword
    );

    // 정렬 조건만 있는 경우
    @Query("""
            SELECT new com.damul.api.recipe.dto.response.RecipeList(
                r.id, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname)
            FROM Recipe r
            JOIN r.user u
            LEFT JOIN Recipe prev ON prev.id = :cursor
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
            Pageable pageable,
            @Param("orderBy") String orderBy
    );

    // 검색 조건과 정렬 조건이 모두 있는 경우
    @Query("""
            SELECT new com.damul.api.recipe.dto.response.RecipeList(
                r.id, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname)
            FROM Recipe r
            JOIN r.user u
            LEFT JOIN Recipe prev ON prev.id = :cursor
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
            SELECT new com.damul.api.mypage.dto.response.MyRecipeList(
                r.id,
                r.title,
                r.content,
                r.thumbnailUrl,
                r.createdAt
            )
            FROM Recipe r
            WHERE r.user.id = :userId
            AND r.deleted = false
            AND (:cursor = 0 OR r.id < :cursor)
            ORDER BY r.id DESC
            LIMIT :size
            """)
    List<MyRecipeList> findMyRecipes(
            @Param("userId") int userId,
            @Param("cursor") int cursor,
            @Param("size") int size
    );

    boolean existsByUserIdAndIdLessThan(int userId, int id);

}