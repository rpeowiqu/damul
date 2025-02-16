package com.damul.api.ingredient.repository;

import com.damul.api.ingredient.dto.response.IngredientsProductNameList;
import com.damul.api.ingredient.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Integer> {
    // 카테고리 ID로 식품 항목 찾기
    List<FoodItem> findByCategoryId(Long categoryId);

    // 아이템 코드로 식품 항목 찾기
    List<FoodItem> findByItemCode(String itemCode);

    // 원산지로 식품 항목 찾기
    List<FoodItem> findByOrigin(String origin);

    // 아이템 이름으로 식품 항목 찾기
    List<FoodItem> findByItemName(String itemName);

    @Query("SELECT new com.damul.api.ingredient.dto.response.IngredientsProductNameList(" +
            "f.categoryId, CONCAT(f.itemName, ' ', f.kindName), f.itemCode, f.kindCode)" +
            "FROM FoodItem f")
    List<IngredientsProductNameList> findAllProductNames();
}
