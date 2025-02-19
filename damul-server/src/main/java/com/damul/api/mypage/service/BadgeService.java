package com.damul.api.mypage.service;

import com.damul.api.auth.entity.User;
import com.damul.api.common.TimeZoneConverter;
import com.damul.api.main.repository.UserIngredientRepository;
import com.damul.api.mypage.entity.Badge;
import com.damul.api.mypage.entity.UserBadge;
import com.damul.api.mypage.repository.BadgeRepository;
import com.damul.api.mypage.repository.FoodPreferenceRepository;
import com.damul.api.mypage.repository.UserBadgeRepository;
import com.damul.api.post.repository.PostRepository;
import com.damul.api.recipe.repository.RecipeRepository;
import com.damul.api.user.repository.FollowRepository;
import com.damul.api.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
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

    /**
     * 배치 작업 관련 상수
     * BATCH_LOCK_KEY: Redis 분산 락을 위한 키 형식
     * BATCH_SIZE: 한 번에 처리할 사용자 수 (메모리 사용량 조절)
     * BADGE_STANDARDS: 배지 레벨별 기준값 (1개, 10개, 50개, 100개, 500개)
     */
    private static final String BATCH_LOCK_KEY = "badge_batch_lock:%s";
    private static final int BATCH_SIZE = 100;
    private static final short[] BADGE_STANDARDS = {1, 10, 50, 100, 500};
    private final RedisTemplate<String, String> redisTemplate;
    private final FoodPreferenceRepository foodPreferenceRepository;

    /**
     * 배지 수여 배치 작업 메인 메서드
     * 현재 매일 자정(KST)에 실행되도록 설정
     *
     * 참고: PriceBatchService와 같이 새벽 3시로 변경하려면 다음과 같이 수정
     * @Scheduled(cron = "0 0 18 * * *")  // UTC 기준 18시 = KST 03시
     *
     * 주의사항:
     * 1. PriceBatchService는 카테고리별로 시간 분산되어 있지만,
     *    BadgeService는 한 번에 모든 종류의 배지를 처리
     * 2. DB 부하를 고려하여 PriceBatchService 실행 시간과 겹치지 않게 조정 필요
     */
    @Async
    @Scheduled(cron = "0 0 17 * * *")  // UTC 17:00 = KST 02:00
//    @Scheduled(cron = "0 0 7 * * *")  // UTC 06:55 = KST 15:55
    public void checkAndAwardBadges() {
        // Redis 분산 락 설정
        String lockKey = String.format(BATCH_LOCK_KEY, "daily");
        String lockValue = LocalDateTime.now().toString();
        boolean locked = false;

        try {
            // 2시간 동안 유효한 분산 락 획득 시도
            // 다른 서버에서 이미 배치가 실행 중이면 종료
            locked = redisTemplate.opsForValue()
                    .setIfAbsent(lockKey, lockValue, Duration.ofMinutes(45));

            if (!locked) {
                log.info("배지 배치 작업이 이미 실행 중입니다.");
                return;
            }

            log.info("배지 배치 업데이트 시작");
            List<User> users = userRepository.findAll();

            // 사용자 목록을 BATCH_SIZE 단위로 분할하여 처리
            // 메모리 사용량 제어 및 DB 부하 분산
            for (int i = 0; i < users.size(); i += BATCH_SIZE) {
                int end = Math.min(i + BATCH_SIZE, users.size());
                List<User> batchUsers = users.subList(i, end);

                // 각 사용자별 배지 처리
                // 한 사용자의 실패가 다른 사용자 처리에 영향을 주지 않도록 예외 처리
                for (User user : batchUsers) {
                    try {
                        processUserBadges(user);
                    } catch (Exception e) {
                        log.error("사용자({}) 배지 업데이트 실패: {}", user.getId(), e.getMessage());
                    }
                }

                // 진행 상황 모니터링을 위한 로그
                log.info("배지 처리 진행률: {}/{}",
                        Math.min(i + BATCH_SIZE, users.size()),
                        users.size());

                // DB 부하 분산을 위한 처리 간격 추가
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("배치 처리 중단됨", e);
                }
            }

            log.info("배지 배치 업데이트 완료");
        } catch (Exception e) {
            log.error("배지 배치 처리 실패: {}", e.getMessage());
        } finally {
            // 배치 작업 완료 후 반드시 락 해제
            if (locked) {
                redisTemplate.delete(lockKey);
            }
        }
    }

    /**
     * 단일 사용자에 대한 모든 종류의 배지 검사 및 수여
     * 각 배지 타입별로 독립적으로 처리되어 한 배지 처리 실패가
     * 다른 배지 처리에 영향을 주지 않음
     */
    private void processUserBadges(User user) {
        checkJoinDayBadge(user);          // 가입일 기준 배지
        checkIngredientCategoryBadges(user); // 식재료 카테고리별 배지
        checkPostBadges(user);            // 게시글 수 기준 배지
        checkRecipeBadges(user);          // 레시피 수 기준 배지
        checkFollowerBadge(user);         // 팔로워 수 기준 배지
    }

    /**
     * 새로운 배지 수여 또는 기존 배지 레벨 업그레이드
     * 트랜잭션 처리가 되어있어 배지 저장 실패 시 자동 롤백
     */
    private void awardBadge(User user, String badgeTitle, short achieved) {
        // 달성 기준에 해당하는 배지 조회
        Optional<Badge> newBadge = badgeRepository.findByTitleAndStandard(badgeTitle, achieved);
        if (newBadge.isEmpty()) {
            return;
        }

        // 사용자의 현재 최고 레벨 배지 조회
        Optional<UserBadge> existingBadge = userBadgeRepository
                .findTopByUserAndBadge_TitleOrderByBadge_LevelDesc(user, badgeTitle);

        if (existingBadge.isPresent()) {
            // 기존 배지가 있는 경우 레벨 업그레이드 필요 여부 확인
            Badge currentBadge = existingBadge.get().getBadge();
            if (newBadge.get().getLevel() > currentBadge.getLevel()) {
                existingBadge.get().updateBadge(newBadge.get());
                log.info("사용자 {} 배지 {} 레벨 {} 업데이트 완료",
                        user.getId(), badgeTitle, newBadge.get().getLevel());
            }
        } else {
            // 새로운 배지 수여
            UserBadge userBadge = UserBadge.builder()
                    .user(user)
                    .badge(newBadge.get())
                    .build();
            userBadge.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
            userBadgeRepository.save(userBadge);
            log.info("사용자 {} 새 배지 {} 레벨 {} 획득",
                    user.getId(), badgeTitle, newBadge.get().getLevel());
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
            Integer count = foodPreferenceRepository.findByUserIdAndCategoryId(
                    user.getId(),
                    entry.getKey())
                    .get()
                    .getCategoryPreference();

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