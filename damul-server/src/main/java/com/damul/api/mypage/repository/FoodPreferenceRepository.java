package com.damul.api.mypage.repository;

import com.damul.api.mypage.dto.response.FoodPreferenceList;
import com.damul.api.mypage.entity.FoodPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodPreferenceRepository extends JpaRepository<FoodPreference, Integer> {

    @Query("""
        SELECT new com.damul.api.mypage.dto.response.FoodPreferenceList(
            fc.id,
            fc.categoryName,
            COALESCE(fp.categoryPreference, 0)
        )
        FROM FoodCategory fc
        LEFT JOIN FoodPreference fp ON fc.id = fp.category.id AND fp.user.id = :userId
        ORDER BY fc.id ASC
        """)
    List<FoodPreferenceList> findPreferencesByUserId(@Param("userId") int userId);

    Optional<FoodPreference> findByUserIdAndCategoryId(int userId, int categoryId);

}
