package com.damul.api.recipe.repository;


import com.damul.api.auth.entity.User;
import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.entity.RecipeLike;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecipeLikeRepository extends JpaRepository<RecipeLike, Integer> {
    boolean existsByRecipe_IdAndUser_Id(int recipeId, int userId);

    Optional<RecipeLike> findByRecipe_IdAndUser_Id(int recipeId, int userId);

}
