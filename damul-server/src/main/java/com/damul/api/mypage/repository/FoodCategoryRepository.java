package com.damul.api.mypage.repository;

import com.damul.api.mypage.entity.FoodCategory;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FoodCategoryRepository {

    Optional<FoodCategory> findById(int categoryId);

}
