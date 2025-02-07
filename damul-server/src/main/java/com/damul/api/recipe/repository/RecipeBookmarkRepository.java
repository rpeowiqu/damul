package com.damul.api.recipe.repository;

import com.damul.api.auth.entity.User;
import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.entity.RecipeBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeBookmarkRepository extends JpaRepository<RecipeBookmark, Integer> {
    boolean existsByRecipeAndUser(Recipe recipe, User user);

    boolean existsByRecipe_IdAndUser_Id(int recipeId, int userId);
}