package com.damul.api.scheduler;

import com.damul.api.recipe.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class ViewCountSyncScheduler {
    private final RedisTemplate<String, String> redisTemplate;
    private final RecipeRepository recipeRepository;

    private static final String VIEW_COUNT_KEY = "recipe:view:";

    //@Scheduled(fixedRate = 300000) // 5분마다 실행
    @Transactional
    public void syncViewCountToDatabase() {
//        try {
//            // 1. Redis에서 모든 조회수 키 조회
//            Set<String> keys = redisTemplate.keys(VIEW_COUNT_KEY + "*");
//            if (keys == null || keys.isEmpty()) {
//                return;
//            }
//
//
//            // 2. 각 레시피의 조회수를 DB에 동기화
//            for (String key : keys) {
//                try {
//                    String viewCount = redisTemplate.opsForValue().get(key);
//                    if (viewCount == null) continue;
//
//                    int recipeId = Integer.parseInt(key.replace(VIEW_COUNT_KEY, ""));
//                    recipeRepository.updateViewCount(recipeId, Integer.parseInt(viewCount));
//
//                    log.debug("View count synced for recipe {}: {}", recipeId, viewCount);
//                } catch (Exception e) {
//                    log.error("Error syncing view count for key: " + key, e);
//                }
//            }
//        } catch (Exception e) {
//            log.error("Error during view count sync", e);
//        }
    }
}
