package com.damul.api.recipe.repository;

import com.damul.api.auth.entity.User;
import com.damul.api.mypage.dto.response.MyRecipeList;
import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.entity.RecipeBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeBookmarkRepository extends JpaRepository<RecipeBookmark, Integer> {
    boolean existsByRecipe_IdAndUser_Id(int recipeId, int userId);
    Optional<RecipeBookmark> findByRecipe_IdAndUser_Id(int recipeId, int userId);
}