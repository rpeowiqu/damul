package com.damul.api.mypage.repository;

import com.damul.api.mypage.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Integer> {

    List<Badge> findByTitleAndStandardLessThanEqual(String title, short standard);

    Optional<Badge> findByTitleAndStandard(String title, short standard);

    @Query("SELECT DISTINCT b.title FROM Badge b")
    List<String> findDistinctTitles();
}