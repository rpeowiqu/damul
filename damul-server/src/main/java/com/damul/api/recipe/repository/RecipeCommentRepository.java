package com.damul.api.recipe.repository;

import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.entity.RecipeComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeCommentRepository extends JpaRepository<RecipeComment, Integer> {
    List<RecipeComment> findByRecipeOrderByCreatedAtDesc(Recipe recipe);
}