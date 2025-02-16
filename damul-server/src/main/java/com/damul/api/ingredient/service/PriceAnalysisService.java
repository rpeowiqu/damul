package com.damul.api.ingredient.service;

import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.ingredient.dto.response.IngredientPriceResponse;
import com.damul.api.ingredient.dto.response.PriceData;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Slf4j
@Service
@RequiredArgsConstructor
public class PriceAnalysisService {
    private final KamisApiService kamisApiService;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String REDIS_KEY_PATTERN = "price:%s:itemCode:%s:itemCategoryCode:%s:date:%s";
    private static final Duration CACHE_TTL = Duration.ofHours(24); // 기본 24시간


    public IngredientPriceResponse  analyzePrices(String itemCode, String period, LocalDate currentDate, String itemCategoryCode) {
        // Redis 키 생성
        String redisKey = String.format(REDIS_KEY_PATTERN, period, itemCode, itemCategoryCode,
                currentDate.format(DateTimeFormatter.BASIC_ISO_DATE));

        // Redis에서 조회
        String cachedData = redisTemplate.opsForValue().get(redisKey);
        if (cachedData != null) {
            try {
                return objectMapper.readValue(cachedData, IngredientPriceResponse.class);
            } catch (JsonProcessingException e) {
                log.error("Redis 캐시 데이터 파싱 실패", e);
            }
        }

        // 캐시 미스시 API 호출
        LocalDate startDate = currentDate.minusYears(1);
        String response = kamisApiService.getPrice(itemCode, itemCategoryCode);


        IngredientPriceResponse result = analyzePriceData(response, period, itemCode);

        try {
            redisTemplate.opsForValue().set(redisKey, objectMapper.writeValueAsString(result), CACHE_TTL);
        } catch (JsonProcessingException e) {
            log.error("데이터 캐싱 실패", e);
        }

        return result;
    }


    private IngredientPriceResponse analyzePriceData(String jsonResponse, String period, String itemCode) {
        try {
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode dataNode = rootNode.path("data");


            String name = extractItemName(dataNode);

            List<PriceData> prices = calculatePrices(dataNode, period);

            return IngredientPriceResponse.builder()
                    .productName(name)
                    .prices(prices)
                    .build();

        } catch (Exception e) {
            log.error("데이터 분석 실패", e);
            throw new BusinessException(ErrorCode.DATA_ANALYSIS_ERROR);
        }
    }

    private String extractItemName(JsonNode dataNode) {
        for (JsonNode item : dataNode.path("item")) {
            JsonNode kindNameNode = item.path("kindname");
            JsonNode itemNameNode = item.path("itemname");


            // 첫 번째로 발견된 유효한 값을 반환
            if ((!itemNameNode.isMissingNode() && !itemNameNode.isNull() && !itemNameNode.asText().isEmpty()) ||
                    (!kindNameNode.isMissingNode() && !kindNameNode.isNull() && !kindNameNode.asText().isEmpty())) {

                String itemName = itemNameNode.isNull() ? "" : itemNameNode.asText();
                String kindName = kindNameNode.isNull() ? "" : kindNameNode.asText();

                // 둘 중 하나라도 있으면 조합
                if (!itemName.isEmpty() || !kindName.isEmpty()) {
                    String result = (itemName + " " + kindName).trim();

                    log.info("추출된 itemName: {}", itemName);
                    log.info("추출된 kindName: {}", kindName);

                    return result.isEmpty() ? "알 수 없는 종류" : result;
                }
            }
        }

        log.warn("itemName을 찾지 못했습니다.");
        return "알 수 없는 종류";
    }

    private List<PriceData> calculatePrices(JsonNode dataNode, String period) {
        List<PriceData> prices = new ArrayList<>();

        // 전체 아이템을 날짜 순으로 정렬
        List<JsonNode> allItems = StreamSupport.stream(dataNode.path("item").spliterator(), false)
                .filter(item -> {
                    String priceStr = item.path("price").asText().trim();
                    // "-" 또는 빈 문자열 제외
                    return !priceStr.equals("-") && !priceStr.isEmpty();
                })
                .sorted((a, b) -> {
                    String dateA = a.get("yyyy").asText() + "-" + a.get("regday").asText();
                    String dateB = b.get("yyyy").asText() + "-" + b.get("regday").asText();
                    return dateB.compareTo(dateA);
                })
                .collect(Collectors.toList());

        if ("monthly".equals(period)) {
            // 최근 6개월 평균 데이터
            Map<String, List<Integer>> monthlyPriceMap = new LinkedHashMap<>();

            for (JsonNode item : allItems) {
                String yearMonth = item.get("yyyy").asText() + "-"
                        + item.get("regday").asText().split("/")[0];
                String priceStr = item.get("price").asText().replace(",", "");

                try {
                    int price = Integer.parseInt(priceStr);
                    monthlyPriceMap.computeIfAbsent(yearMonth, k -> new ArrayList<>()).add(price);
                } catch (NumberFormatException e) {
                    log.warn("월별 가격 변환 실패: {}", priceStr);
                }
            }

            prices = monthlyPriceMap.entrySet().stream()
                    .map(entry -> PriceData.builder()
                            .period(entry.getKey())
                            .price((int) entry.getValue().stream()
                                    .mapToInt(Integer::intValue)
                                    .average()
                                    .orElse(0))
                            .build())
                    .sorted(Comparator.comparing(PriceData::getPeriod))
                    .collect(Collectors.toList());

            log.info("총 아이템 수: {}", allItems.size());
            log.info("월/주별 가격 맵: {}", monthlyPriceMap); // 또는 weeklyPriceMap
        } else if ("recent".equals(period)) {
            // 한 달 전까지의 주 평균 데이터
            Map<String, List<Integer>> weeklyPriceMap = new LinkedHashMap<>();

            for (JsonNode item : allItems) {
                String dateStr = item.get("yyyy").asText() + "-" + item.get("regday").asText();
                LocalDate itemDate = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM/dd"));

                // 한 달 전까지의 데이터만 필터링
                if (itemDate.isAfter(LocalDate.now().minusMonths(1))) {
                    // 해당 날짜가 속한 주의 시작일 계산
                    LocalDate weekStart = itemDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                    String weekKey = weekStart.format(DateTimeFormatter.ISO_LOCAL_DATE);

                    String priceStr = item.get("price").asText().replace(",", "");

                    try {
                        int price = Integer.parseInt(priceStr);
                        weeklyPriceMap.computeIfAbsent(weekKey, k -> new ArrayList<>()).add(price);
                    } catch (NumberFormatException e) {
                        log.warn("주간 가격 변환 실패: {}", priceStr);
                    }
                }
            }

            prices = weeklyPriceMap.entrySet().stream()
                    .map(entry -> PriceData.builder()
                            .period(entry.getKey())
                            .price((int) entry.getValue().stream()
                                    .mapToInt(Integer::intValue)
                                    .average()
                                    .orElse(0))
                            .build())
                    .sorted(Comparator.comparing(PriceData::getPeriod))
                    .collect(Collectors.toList());

            log.info("총 아이템 수: {}", allItems.size());
            log.info("월/주별 가격 맵: {}", weeklyPriceMap); // 또는 weeklyPriceMap
        }



        return prices;
    }
}
