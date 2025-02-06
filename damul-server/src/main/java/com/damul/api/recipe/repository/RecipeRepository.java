package com.damul.api.recipe.repository;

import com.damul.api.recipe.dto.response.RecipeList;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository {

    @Query("SELECT new com.damul.api.recipe.dto.response.RecipeList( " +
            "r.recipeId, r.title, r.thumbnailUrl, r.content, r.createdAt, " +
            "r.user.id, r.user.nickname) " +
            "FROM Recipe r " +
            "JOIN r.user " +
            "WHERE r.isDeleted = false " +
            "ORDER BY r.createdAt DESC")
    List<RecipeList> getAllRecipes();
}
