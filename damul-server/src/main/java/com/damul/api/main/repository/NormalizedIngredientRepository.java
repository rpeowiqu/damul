package com.damul.api.main.repository;

import com.damul.api.main.entity.NormalizedIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NormalizedIngredientRepository extends JpaRepository<NormalizedIngredient, Integer> {
    Optional<NormalizedIngredient> findByName(String name);
}