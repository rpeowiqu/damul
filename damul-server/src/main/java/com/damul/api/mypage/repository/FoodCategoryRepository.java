package com.damul.api.mypage.repository;

import com.damul.api.mypage.entity.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Integer> {

    Optional<FoodCategory> findById(int categoryId);

}
