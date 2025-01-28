package com.damul.api.main.repository;

import com.damul.api.main.dto.HomeIngredientDetail;
import com.damul.api.main.entity.UserIngredient;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserIngredientRepository extends JpaRepository<UserIngredient, Integer> {

    // 사용자 ID로 재료 목록 조회
    List<UserIngredient> findByUserId(int userId);

    List<UserIngredient> findByUserIdAndIngredientNameContaining(
            int userId,
            String keyword,
            Sort sort
    );

    @Query("SELECT new com.damul.api.main.dto.HomeIngredientDetail(" +
            "ui.userIngredientId, ui.categoryId, ui.ingredientQuantity, " +
            "ui.ingredientUp, ui.ingredientName, ui.dueDate, ui.user.warning) " +  // user 관계 사용
            "FROM UserIngredient ui " +
            "WHERE ui.userIngredientId = :ingredientId")
    HomeIngredientDetail findHomeIngredientDetailById(@Param("ingredientId") int ingredientId);

}
