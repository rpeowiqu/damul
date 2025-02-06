package com.damul.api.recipe.repository;

import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.entity.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Integer> {
    List<RecipeIngredient> findByRecipeOrderByIngredientOrder(Recipe recipe);
}