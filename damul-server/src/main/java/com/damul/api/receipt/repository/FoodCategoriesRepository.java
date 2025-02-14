package com.damul.api.receipt.repository;

import com.damul.api.receipt.entity.FoodCategories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodCategoriesRepository extends JpaRepository<FoodCategories, Integer> {

}
