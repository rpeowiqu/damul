package com.damul.api.recipe.repository;

import com.damul.api.recipe.entity.RecipeTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeTagRepository extends JpaRepository<RecipeTag, Integer> {
    @Query("SELECT rt FROM RecipeTag rt JOIN FETCH rt.tag WHERE rt.recipe.id = :recipeId")
    List<RecipeTag> findByRecipeId(@Param("recipeId") int recipeId);
}
