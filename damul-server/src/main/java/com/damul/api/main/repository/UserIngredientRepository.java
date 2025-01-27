package com.damul.api.main.repository;

import com.damul.api.main.entity.UserIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserIngredientRepository extends JpaRepository<UserIngredient, Integer> {
    // 사용자 ID로 재료 목록 조회
    List<UserIngredient> findByUserId(int userId);
}
