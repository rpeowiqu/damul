package com.damul.api.ingredient.service;

import com.damul.api.ingredient.dto.FoodCategory;
import com.damul.api.ingredient.dto.response.IngredientPriceResponse;
import com.damul.api.ingredient.entity.FoodItem;
import com.damul.api.ingredient.repository.FoodItemRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @Async
    @Scheduled(cron = "0 0 18 * * *")  // UTC 새벽 3시 (KST)
    public void updateVegetablePrices() {
        updatePricesByCategory(FoodCategory.VEGETABLE);
    }

    @Async
    @Scheduled(cron = "0 10 18 * * *")  // UTC 새벽 3시 10분 후 (KST)
    public void updateFruitPrices() {
        updatePricesByCategory(FoodCategory.FRUIT);
    }

    @Async
    @Scheduled(cron = "0 20 18 * * *")  // UTC 새벽 3시 20분 후 (KST)
    public void updateDairyPrices() {
        updatePricesByCategory(FoodCategory.DAIRY);
    }

    @Async
    @Scheduled(cron = "0 30 18 * * *")  // UTC 새벽 3시 30분 후 (KST)
    public void updateMeatPrices() {
        updatePricesByCategory(FoodCategory.MEAT);
    }

    @Async
    @Scheduled(cron = "0 40 18 * * *")  // UTC 새벽 3시 40분 후 (KST)
    public void updateEggPrices() {
        updatePricesByCategory(FoodCategory.EGG);
    }

    @Async
    @Scheduled(cron = "0 50 18 * * *")  // UTC 새벽 3시 50분 후 (KST)
    public void updateSeafoodPrices() {
        updatePricesByCategory(FoodCategory.SEAFOOD);
    }

    @Async
    @Scheduled(cron = "0 0 19 * * *")  // UTC 새벽 4시 (KST)
    public void updateOilPrices() {
        updatePricesByCategory(FoodCategory.OIL);
    }

    @Async
    @Scheduled(cron = "0 10 19 * * *")  // UTC 새벽 4시 10분 후 (KST)
    public void updateSeasoningPrices() {
        updatePricesByCategory(FoodCategory.SEASONING);
    }

    @Async
    @Scheduled(cron = "0 20 19 * * *")  // UTC 새벽 4시 20분 후 (KST)
    public void updateOtherPrices() {
        updatePricesByCategory(FoodCategory.OTHER);
    }

    public void updatePricesByCategory(FoodCategory category) {
        String lockKey = String.format(BATCH_LOCK_KEY, category.getName());
        String lockValue = LocalDateTime.now().toString();
        boolean locked = false;

        try {
            locked = redisTemplate.opsForValue()
                    .setIfAbsent(lockKey, lockValue, Duration.ofMinutes(10));

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

    public void updateItemPrice(FoodItem item, String period, boolean ecoFlag) {
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