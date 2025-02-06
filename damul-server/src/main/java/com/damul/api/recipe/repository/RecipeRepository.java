package com.damul.api.recipe.repository;

import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {

    // 전체조회
    @Query("SELECT new com.damul.api.recipe.dto.response.RecipeList(" +
            "r.recipeId, r.title, r.thumbnailUrl, r.content, r.createdAt, " +
            "r.user.id, r.user.nickname) " +
            "FROM Recipe r " +
            "JOIN r.user u " +
            "WHERE r.isDeleted = false " +
            "AND r.recipeId > :cursorId " +
            "ORDER BY r.createdAt DESC ")
    List<RecipeList> findAllRecipes(@Param("cursorId") int cursorId,
                                    @Param("size") int size);
    
    // 검색어 있는 경우
    @Query("SELECT new com.damul.api.recipe.dto.response.RecipeList(" +
            "r.recipeId, r.title, r.thumbnailUrl, r.content, r.createdAt, " +
            "r.user.id, r.user.nickname) " +
            "FROM Recipe r " +
            "JOIN r.user u " +
            "WHERE r.isDeleted = false " +
            "AND r.recipeId > :cursorId " +
            "AND (:searchType = 'author' AND u.nickname LIKE %:keyword% OR " +
            "     :searchType = 'content' AND (r.title LIKE %:keyword% OR r.content LIKE %:keyword%)) " +
            "ORDER BY r.createdAt DESC ")
    List<RecipeList> findBySearch(@Param("cursorId") int cursorId,
                                  @Param("size") int size,
                                  @Param("searchType") String searchType,
                                  @Param("keyword") String keyword);


    @Query("SELECT new com.damul.api.recipe.dto.response.RecipeList(" +
            "r.recipeId, r.title, r.thumbnailUrl, r.content, r.createdAt, " +
            "r.user.id, r.user.nickname) " +
            "FROM Recipe r " +
            "JOIN r.user u " +
            "WHERE r.isDeleted = false " +
            "AND r.recipeId > :cursorId " +
            "ORDER BY " +
            "CASE WHEN :orderBy = 'likes' THEN r.likeCnt " +
            "     WHEN :orderBy = 'views' THEN r.viewCnt " +
            "     ELSE r.createdAt END " +
            "CASE WHEN :orderByDir = 'ASC' THEN ASC ELSE DESC END " +
            "LIMIT :size + 1")
    List<RecipeList> findAllWithOrder(@Param("cursorId") int cursorId,
                                      @Param("size") int size,
                                      @Param("orderBy") String orderBy,
                                      @Param("orderByDir") String orderByDir);




    @Query("SELECT new com.damul.api.recipe.dto.response.RecipeList(" +
            "r.recipeId, r.title, r.thumbnailUrl, r.content, r.createdAt, " +
            "r.user.id, r.user.nickname) " +
            "FROM Recipe r " +
            "JOIN r.user u " +
            "WHERE r.isDeleted = false " +
            "AND r.recipeId > :cursorId " +
            "AND (:searchType = 'author' AND u.nickname LIKE %:keyword% OR " +
            "     :searchType = 'content' AND (r.title LIKE %:keyword% OR r.content LIKE %:keyword%)) " +
            "ORDER BY " +
            "CASE " +
            "    WHEN :orderBy = 'likes' AND :orderByDir = 'DESC' THEN r.likeCnt " +
            "    WHEN :orderBy = 'likes' AND :orderByDir = 'ASC' THEN r.likeCnt " +
            "    WHEN :orderBy = 'views' AND :orderByDir = 'DESC' THEN r.viewCnt " +
            "    WHEN :orderBy = 'views' AND :orderByDir = 'ASC' THEN r.viewCnt " +
            "    ELSE r.createdAt " +
            "END DESC " +
            "LIMIT :size")
    List<RecipeList> findBySearchWithOrder(@Param("cursorId") int cursorId,
                                           @Param("size") int size,
                                           @Param("searchType") String searchType,
                                           @Param("keyword") String keyword,
                                           @Param("orderBy") String orderBy,
                                           @Param("orderByDir") String orderByDir);
}
