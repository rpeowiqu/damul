package com.damul.api.mypage.service;

import com.damul.api.auth.entity.User;
import com.damul.api.common.TimeZoneConverter;
import com.damul.api.main.repository.UserIngredientRepository;
import com.damul.api.mypage.entity.Badge;
import com.damul.api.mypage.entity.UserBadge;
import com.damul.api.mypage.repository.BadgeRepository;
import com.damul.api.mypage.repository.UserBadgeRepository;
import com.damul.api.post.repository.PostRepository;
import com.damul.api.recipe.repository.RecipeRepository;
import com.damul.api.user.repository.FollowRepository;
import com.damul.api.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BadgeService {

    private final UserBadgeRepository userBadgeRepository;
    private final BadgeRepository badgeRepository;
    private final UserRepository userRepository;
    private final UserIngredientRepository userIngredientRepository;
    private final PostRepository postRepository;
    private final RecipeRepository recipeRepository;
    private final FollowRepository followRepository;
    private final TimeZoneConverter timeZoneConverter;

    @Scheduled(cron = "0 0 0 * * *") // 매일 자정 실행
    public void checkAndAwardBadges() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            try {
                checkJoinDayBadge(user);
                checkIngredientCategoryBadges(user);
                checkPostBadges(user);
                checkRecipeBadges(user);
                checkFollowerBadge(user);
            } catch (Exception e) {
                log.error("Error processing badges for user {}: {}", user.getId(), e.getMessage());
            }
        }
    }

    private void awardBadge(User user, String badgeTitle, short achieved) {
        Optional<Badge> newBadge = badgeRepository.findByTitleAndStandard(badgeTitle, achieved);
        if (newBadge.isEmpty()) {
            return;
        }

        // 같은 타입의 뱃지 중 가장 높은 레벨의 뱃지를 찾음
        Optional<UserBadge> existingBadge = userBadgeRepository.findTopByUserAndBadge_TitleOrderByBadge_LevelDesc(user, badgeTitle);

        if (existingBadge.isPresent()) {
            Badge currentBadge = existingBadge.get().getBadge();
            // 새로운 뱃지의 레벨이 더 높은 경우에만 업데이트
            if (newBadge.get().getLevel() > currentBadge.getLevel()) {
                existingBadge.get().updateBadge(newBadge.get());
                log.info("Updated badge {} to level {} for user {}",
                        badgeTitle, newBadge.get().getLevel(), user.getId());
            }
        } else {
            // 처음 획득하는 뱃지인 경우 새로 생성
            UserBadge userBadge = UserBadge
                    .builder()
                    .user(user)
                    .badge(newBadge.get())
                    .build();
            userBadge.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
            userBadgeRepository.save(userBadge);
            log.info("Awarded new badge {} level {} to user {}",
                    badgeTitle, newBadge.get().getLevel(), user.getId());
        }
    }

    private void checkJoinDayBadge(User user) {
        long daysSinceJoin = ChronoUnit.DAYS.between(user.getCreatedAt().toLocalDate(), LocalDate.now());

        short[] standards = {1, 10, 50, 100, 500};
        for (short standard : standards) {
            if (daysSinceJoin >= standard) {
                awardBadge(user, "다믈랭과의 인연", standard);
            }
        }
    }

    private void checkIngredientCategoryBadges(User user) {
        Map<Integer, String> categoryBadges = Map.of(
                6, "넌 부화할 수 없다",  // 달걀류
                4, "목표키 2m",        // 유제품
                3, "과즙팡팡",         // 과일
                5, "육식 공룡",        // 육류
                2, "나는 자연인이다",   // 채소
                7, "포세이돈",         // 수산물
                9, "간장공장공장장",    // 양념
                8, "미끄러짐 주의",     // 기름
                1, "농부의 피땀을 아는 자", // 곡물
                10, "줏대없는 자취생"    // 기타
        );

        for (Map.Entry<Integer, String> entry : categoryBadges.entrySet()) {
            Integer count = userIngredientRepository.countByCategoryIdAndUserReciept_User_Id(entry.getKey(), user.getId());

            short[] standards = {1, 10, 50, 100, 500};
            for (short standard : standards) {
                if (count >= standard) {
                    awardBadge(user, entry.getValue(), standard);
                }
            }
        }
    }

    private void checkPostBadges(User user) {
        Integer sharePostCount = postRepository.countByUser_IdAndStatus(user.getId(), "ACTIVE");

        short[] standards = {1, 10, 50, 100, 500};
        for (short standard : standards) {
            if (sharePostCount >= standard) {
                awardBadge(user, "Divider", standard);
            }
        }
    }

    private void checkRecipeBadges(User user) {
        Integer recipeCount = recipeRepository.countByUser_IdAndDeletedFalse(user.getId());

        short[] standards = {1, 10, 50, 100, 500};
        for (short standard : standards) {
            if (recipeCount >= standard) {
                awardBadge(user, "레시퍼", standard);
            }
        }
    }

    private void checkFollowerBadge(User user) {
        Integer followerCount = followRepository.countByFollowingId(user.getId());

        short[] standards = {1, 10, 50, 100, 500};
        for (short standard : standards) {
            if (followerCount >= standard) {
                awardBadge(user, "인싸의 길", standard);
            }
        }
    }
}