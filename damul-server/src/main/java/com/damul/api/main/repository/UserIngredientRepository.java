package com.damul.api.main.repository;

import com.damul.api.main.dto.response.HomeIngredientDetail;
import com.damul.api.main.entity.UserIngredient;
import com.damul.api.recipe.entity.Recipe;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserIngredientRepository extends JpaRepository<UserIngredient, Integer> {

    @Query("SELECT ui FROM UserIngredient ui " +
            "WHERE ui.userReciept.user.id = :userId " +
            "AND ui.isDeleted = false")
    List<UserIngredient> findAllByUserId(@Param("userId") int userId);

    @Query("SELECT ui FROM UserIngredient ui WHERE ui.userIngredientId = :id AND ui.isDeleted = false")
    Optional<UserIngredient> findByIdAndNotDeleted(@Param("id") int userIngredientId);

    @Query("SELECT ui FROM UserIngredient ui " +
            "WHERE ui.userReciept.user.id = :userId " +
            "AND ui.ingredientName LIKE %:keyword% " +
            "AND ui.isDeleted = false")
    List<UserIngredient> findByUserIdAndIngredientNameContaining(
            @Param("userId") int userId,
            @Param("keyword") String keyword,
            Sort sort
    );

    @Query("SELECT new com.damul.api.main.dto.response.HomeIngredientDetail(" +
            "ui.userIngredientId, ui.categoryId, ui.ingredientQuantity, " +
            "ui.ingredientUp, ui.ingredientName, " +
            "CAST(FUNCTION('DATEDIFF', DATE(ui.dueDate), CURRENT_DATE) AS int)) " +
            "FROM UserIngredient ui " +
            "WHERE ui.userIngredientId = :ingredientId " +
            "AND ui.isDeleted = false")
    HomeIngredientDetail findHomeIngredientDetailById(@Param("ingredientId") int ingredientId);

    @Query("""
        SELECT DISTINCT r FROM Recipe r
        LEFT JOIN FETCH RecipeTag rt ON rt.recipe.id = r.id
        JOIN RecipeIngredient ri ON ri.recipe.id = r.id
        LEFT JOIN UserIngredient ui ON ri.ingredientName = ui.ingredientName
            AND ui.userReciept.user.id = :userId
            AND ui.isDeleted = false
        WHERE r.isDeleted = false
        GROUP BY r.id
        HAVING COUNT(DISTINCT ui.userIngredientId) > 0
        ORDER BY COUNT(DISTINCT ui.userIngredientId) * 1.0 / COUNT(DISTINCT ri.id) DESC,
                 r.likeCnt * 0.3 DESC
        LIMIT 5
    """)
    List<Recipe> findRecommendedRecipes(@Param("userId") int userId);

}
