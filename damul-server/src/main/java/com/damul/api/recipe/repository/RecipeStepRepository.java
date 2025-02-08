package com.damul.api.recipe.repository;

import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.entity.RecipeStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeStepRepository extends JpaRepository<RecipeStep, Integer> {
    List<RecipeStep> findByRecipeOrderByStepNumber(Recipe recipe);
}
