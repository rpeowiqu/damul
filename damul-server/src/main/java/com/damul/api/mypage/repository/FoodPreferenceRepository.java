package com.damul.api.mypage.repository;

import com.damul.api.mypage.dto.response.FoodPreferenceList;
import com.damul.api.mypage.entity.FoodPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodPreferenceRepository extends JpaRepository<FoodPreference, Integer> {

    @Query("""
            SELECT new com.damul.api.mypage.dto.response.FoodPreferenceList(
                fp.category.id,
                fp.category.categoryName,
                fp.categoryPreference
            )
            FROM FoodPreference fp
            WHERE fp.user.id = :userId
            """)
    List<FoodPreferenceList> findPreferencesByUserId(@Param("userId") int userId);

}
