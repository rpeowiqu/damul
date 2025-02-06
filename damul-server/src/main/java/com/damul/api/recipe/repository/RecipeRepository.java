package com.damul.api.recipe.repository;

import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.entity.Recipe;
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
            SELECT new com.damul.api.recipe.dto.response.RecipeList(
                r.recipeId, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname)
            FROM Recipe r
            JOIN r.user u
            WHERE r.isDeleted = false
            AND (:cursorId = 0 OR r.recipeId < :cursorId)
            ORDER BY r.recipeId DESC
            LIMIT :size
            """)
    List<RecipeList> findAllRecipes(
            @Param("cursorId") int cursorId,
            @Param("size") int size
    );

    // 검색 조건만 있는 경우
    @Query("""
            SELECT new com.damul.api.recipe.dto.response.RecipeList(
                r.recipeId, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname)
            FROM Recipe r
            JOIN r.user u
            WHERE r.isDeleted = false
            AND (:cursorId = 0 OR r.recipeId < :cursorId)
            AND (:searchType = 'author' AND u.nickname LIKE %:keyword%
                OR :searchType = 'content' AND (r.title LIKE %:keyword% OR r.content LIKE %:keyword%))
            ORDER BY r.recipeId DESC
            LIMIT :size
            """)
    List<RecipeList> findBySearch(
            @Param("cursorId") int cursorId,
            @Param("size") int size,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword
    );

    // 정렬 조건만 있는 경우
    @Query("""
            SELECT new com.damul.api.recipe.dto.response.RecipeList(
                r.recipeId, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname)
            FROM Recipe r
            JOIN r.user u
            LEFT JOIN Recipe prev ON prev.recipeId = :cursorId
            WHERE r.isDeleted = false
            AND (:cursorId = 0 OR 
                ((:orderBy = 'likes' AND (r.likeCnt < prev.likeCnt OR (r.likeCnt = prev.likeCnt AND r.recipeId < prev.recipeId)))
                OR (:orderBy = 'views' AND (r.viewCnt < prev.viewCnt OR (r.viewCnt = prev.viewCnt AND r.recipeId < prev.recipeId)))
                OR (:orderBy NOT IN ('likes', 'views') AND r.recipeId < :cursorId)))
            ORDER BY
            CASE 
                WHEN :orderBy = 'likes' THEN r.likeCnt
                WHEN :orderBy = 'views' THEN r.viewCnt
                ELSE r.recipeId
            END DESC,
            r.recipeId DESC
            LIMIT :size
            """)
    List<RecipeList> findAllWithOrder(
            @Param("cursorId") int cursorId,
            @Param("size") int size,
            @Param("orderBy") String orderBy
    );

    // 검색 조건과 정렬 조건이 모두 있는 경우
    @Query("""
            SELECT new com.damul.api.recipe.dto.response.RecipeList(
                r.recipeId, r.title, r.thumbnailUrl, r.content, r.createdAt,
                r.user.id, r.user.nickname)
            FROM Recipe r
            JOIN r.user u
            LEFT JOIN Recipe prev ON prev.recipeId = :cursorId
            WHERE r.isDeleted = false
            AND (:cursorId = 0 OR 
                ((:orderBy = 'likes' AND (r.likeCnt < prev.likeCnt OR (r.likeCnt = prev.likeCnt AND r.recipeId < prev.recipeId)))
                OR (:orderBy = 'views' AND (r.viewCnt < prev.viewCnt OR (r.viewCnt = prev.viewCnt AND r.recipeId < prev.recipeId)))
                OR (:orderBy NOT IN ('likes', 'views') AND r.recipeId < :cursorId)))
            AND (:searchType = 'author' AND u.nickname LIKE %:keyword%
                OR :searchType = 'content' AND (r.title LIKE %:keyword% OR r.content LIKE %:keyword%))
            ORDER BY
            CASE 
                WHEN :orderBy = 'likes' THEN r.likeCnt
                WHEN :orderBy = 'views' THEN r.viewCnt
                ELSE r.recipeId
            END DESC,
            r.recipeId DESC
            LIMIT :size
            """)
    List<RecipeList> findBySearchWithOrder(
            @Param("cursorId") int cursorId,
            @Param("size") int size,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword,
            @Param("orderBy") String orderBy
    );


    // 레시피 상세조회 시 조회수증가
    @Modifying
    @Query("UPDATE Recipe r SET r.viewCnt = :viewCount WHERE r.recipeId = :recipeId")
    void updateViewCount(@Param("recipeId") int recipeId, @Param("viewCount") int viewCount);
}