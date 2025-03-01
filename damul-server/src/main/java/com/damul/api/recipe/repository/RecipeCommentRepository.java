package com.damul.api.recipe.repository;

import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.entity.RecipeComment;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeCommentRepository extends JpaRepository<RecipeComment, Integer> {
    List<RecipeComment> findByRecipe_IdAndDeletedFalseOrderByCreatedAtAsc(int recipeId);

    @Modifying
    @Transactional
    @Query("UPDATE RecipeComment c SET c.deleted = true WHERE c.id = :commentId")
    void softDeleteComment(@Param("commentId") int commentId);
}