package com.damul.api.ingredient.service;

import com.damul.api.ingredient.dto.response.IngredientPriceResponse;
import com.damul.api.ingredient.entity.FoodItem;
import com.damul.api.ingredient.repository.FoodItemRepository;
import com.damul.api.ingredient.service.KamisApiService;
import com.damul.api.ingredient.service.PriceAnalysisService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PriceBatchService {
    private final KamisApiService kamisApiService;
    private final PriceAnalysisService priceAnalysisService;
    private final FoodItemRepository foodItemRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String BATCH_LOCK_KEY = "price_batch_lock:%s";
    private static final String BATCH_CACHE_KEY = "batch:price:%s:%s:%s:%s";
    private static final int BATCH_SIZE = 10;

    @Getter
    @AllArgsConstructor
    private enum FoodCategory {
        GRAIN(1, "곡물"),
        FRUIT(2, "과일"),
        OIL(3, "기름"),
        EGG(4, "달걀류"),
        SEAFOOD(5, "수산물"),
        SEASONING(6, "양념"),
        DAIRY(7, "유제품"),
        MEAT(8, "육류"),
        VEGETABLE(9, "채소"),
        OTHER(10, "기타");

        private final int id;
        private final String name;
    }
    @Async
    @Scheduled(cron = "0 10 18 * * *")  // UTC 05:35 (KST 14:35)
    public void updateVegetablePrices() {
        updatePricesByCategory(FoodCategory.VEGETABLE);
    }

    @Async
    @Scheduled(cron = "0 20 18 * * *")  // UTC 05:45 (KST 14:45)
    public void updateFruitPrices() {
        updatePricesByCategory(FoodCategory.FRUIT);
    }

    @Async
    @Scheduled(cron = "0 30 18 * * *")  // UTC 05:55 (KST 14:55)
    public void updateDairyPrices() {
        updatePricesByCategory(FoodCategory.DAIRY);
    }

    @Async
    @Scheduled(cron = "0 40 18 * * *")   // UTC 06:05 (KST 15:05)
    public void updateMeatPrices() {
        updatePricesByCategory(FoodCategory.MEAT);
    }

    @Async
    @Scheduled(cron = "0 50 18 * * *")  // UTC 06:15 (KST 15:15)
    public void updateEggPrices() {
        updatePricesByCategory(FoodCategory.EGG);
    }

    @Async
    @Scheduled(cron = "0 0 19 * * *")  // UTC 06:25 (KST 15:25)
    public void updateSeafoodPrices() {
        updatePricesByCategory(FoodCategory.SEAFOOD);
    }

    @Async
    @Scheduled(cron = "0 10 19 * * *")  // UTC 06:35 (KST 15:35)
    public void updateOilPrices() {
        updatePricesByCategory(FoodCategory.OIL);
    }

    @Async
    @Scheduled(cron = "0 20 19 * * *")  // UTC 06:45 (KST 15:45)
    public void updateSeasoningPrices() {
        updatePricesByCategory(FoodCategory.SEASONING);
    }

    @Async
    @Scheduled(cron = "0 30 19 * * *")  // UTC 06:55 (KST 15:55)
    public void updateOtherPrices() {
        updatePricesByCategory(FoodCategory.OTHER);
    }

    private void updatePricesByCategory(FoodCategory category) {
        String lockKey = String.format(BATCH_LOCK_KEY, category.getName());
        String lockValue = LocalDateTime.now().toString();
        boolean locked = false;

        try {
            locked = redisTemplate.opsForValue()
                    .setIfAbsent(lockKey, lockValue, Duration.ofHours(1));

            if (!locked) {
                log.info("[{}] 카테고리 배치 작업이 이미 실행 중입니다.", category.getName());
                return;
            }

            log.info("[{}] 가격 데이터 배치 업데이트 시작", category.getName());
            List<FoodItem> foodItems = foodItemRepository.findByCategoryId(category.getId());

            for (int i = 0; i < foodItems.size(); i += BATCH_SIZE) {
                int end = Math.min(i + BATCH_SIZE, foodItems.size());
                List<FoodItem> batchItems = foodItems.subList(i, end);

                for (FoodItem item : batchItems) {
                    try {
                        updateItemPrice(item, "monthly", item.isEcoFlag());
                        updateItemPrice(item, "recent", item.isEcoFlag());
                        Thread.sleep(1000);
                    } catch (Exception e) {
                        log.error("[{}] 상품({}) 가격 업데이트 실패: {}",
                                category.getName(), item.getItemName(), e.getMessage());
                    }
                }

                Thread.sleep(5000);
                log.info("[{}] 카테고리 처리 진행률: {}/{}",
                        category.getName(),
                        Math.min(i + BATCH_SIZE, foodItems.size()),
                        foodItems.size());
            }

            log.info("[{}] 가격 데이터 배치 업데이트 완료", category.getName());
        } catch (Exception e) {
            log.error("[{}] 카테고리 가격 업데이트 실패: {}", category.getName(), e.getMessage());
        } finally {
            if (locked) {
                redisTemplate.delete(lockKey);
            }
        }
    }

    private void updateItemPrice(FoodItem item, String period, boolean ecoFlag) {
        try {
            String response = kamisApiService.getPrice(
                    item.getItemCode(),
                    item.getKindCode(),
                    item.isEcoFlag(),
                    period
            );

            IngredientPriceResponse priceData = priceAnalysisService
                    .analyzePriceData(response, period, item.getItemCode(), ecoFlag);

            String cacheKey = String.format(BATCH_CACHE_KEY,
                    period,
                    item.getItemCode(),
                    item.getKindCode(),
                    item.isEcoFlag());

            redisTemplate.opsForValue().set(
                    cacheKey,
                    objectMapper.writeValueAsString(priceData),
                    Duration.ofDays(8)
            );

            log.info("상품[{}] 가격 업데이트 완료", item.getItemName());
        } catch (Exception e) {
            log.error("상품[{}] 가격 업데이트 실패: {}", item.getItemName(), e.getMessage());
        }
    }
}