package com.damul.api.ingredient.service;

import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.ingredient.dto.response.IngredientPriceResponse;
import com.damul.api.ingredient.dto.response.PriceData;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

    private static final String REDIS_KEY_PATTERN = "price:%s:itemCode:%s:itemCategoryCode:%s:date:%s:ecoFlag:%s";
    private static final String BATCH_CACHE_KEY = "batch:price:%s:%s:%s:%s";  // 배치용 캐시 키
    private static final Duration CACHE_TTL = Duration.ofHours(24);

    public IngredientPriceResponse analyzePrices(String itemCode, String period, LocalDate currentDate, String kindCode, boolean ecoFlag) {
        // 먼저 배치 처리된 데이터 확인
        String batchKey = String.format(BATCH_CACHE_KEY, period, itemCode, kindCode, ecoFlag);
        String batchData = redisTemplate.opsForValue().get(batchKey);

        if (batchData != null) {
            try {
                log.info("배치 데이터 존재");
                return objectMapper.readValue(batchData, IngredientPriceResponse.class);
            } catch (JsonProcessingException e) {
                log.error("배치 캐시 데이터 파싱 실패", e);
            }
        }

        // 배치 데이터가 없는 경우 기존 로직 실행
        String redisKey = String.format(REDIS_KEY_PATTERN, period, itemCode, kindCode,
                currentDate.format(DateTimeFormatter.BASIC_ISO_DATE), ecoFlag);

        String cachedData = redisTemplate.opsForValue().get(redisKey);
        if (cachedData != null) {
            try {
                log.info("캐싱 데이터 존재");
                return objectMapper.readValue(cachedData, IngredientPriceResponse.class);
            } catch (JsonProcessingException e) {
                log.error("Redis 캐시 데이터 파싱 실패", e);
            }
        }

        // 캐시에도 없으면 실제 API 호출
        // 여기에 명시적으로 API 호출 로직 추가
        try {
            String response = kamisApiService.getPrice(itemCode, kindCode, ecoFlag, period);
            log.info("API 호출 성공: 응답 길이 = {}", response.length());

            IngredientPriceResponse result = analyzePriceData(response, period, itemCode, ecoFlag);

            try {
                redisTemplate.opsForValue().set(redisKey, objectMapper.writeValueAsString(result), CACHE_TTL);
            } catch (JsonProcessingException e) {
                log.error("데이터 캐싱 실패", e);
            }

            return result;
        } catch (Exception e) {
            log.error("API 호출 또는 데이터 분석 중 오류 발생", e);
            throw new BusinessException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }

    // 배치 처리용 메소드
    public IngredientPriceResponse analyzePriceData(String jsonResponse, String period, String itemCode, boolean ecoFlag) {
        try {
            log.info("데이터 파싱 시작");
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode dataNode = rootNode.path("data");

            List<PriceData> prices;
            if (ecoFlag) {
                log.info("ecoFlag: {}", ecoFlag);
                prices = calculateEcoPrices(dataNode, period);
            } else {
                log.info("ecoFlag: {}", ecoFlag);
                prices = calculateNormalPrices(dataNode, period);
            }

            return IngredientPriceResponse.builder()
                    .priceDataList(prices)
                    .build();

        } catch (Exception e) {
            log.error("데이터 분석 실패", e);
            throw new BusinessException(ErrorCode.DATA_ANALYSIS_ERROR);
        }
    }



    private List<PriceData> calculateEcoPrices(JsonNode rootNode, String period) {
        log.info("친환경 식자재 파싱");
        List<PriceData> prices = new ArrayList<>();

        JsonNode itemsNode = rootNode.path("item");

        List<JsonNode> allItems = StreamSupport.stream(itemsNode.spliterator(), false)
                .filter(item -> {
                    String priceStr = Optional.ofNullable(item.get("price"))
                            .map(JsonNode::asText)
                            .orElse("")
                            .replace(",", "");
                    return !priceStr.equals("-") && !priceStr.isEmpty();
                })
                .sorted((a, b) -> {
                    String currentYear = LocalDate.now().getYear() + "";
                    String dateA = currentYear + "-" + a.get("regday").asText();
                    String dateB = currentYear + "-" + b.get("regday").asText();
                    return dateB.compareTo(dateA);
                })
                .collect(Collectors.toList());

        if ("monthly".equals(period)) {
            // 월별 평균
            Map<String, List<Integer>> monthlyPriceMap = new LinkedHashMap<>();

            for (JsonNode item : allItems) {
                String currentYear = LocalDate.now().getYear() + "";
                String yearMonth = currentYear + "-" + item.get("regday").asText().split("/")[0];
                String priceStr = item.get("price").asText().replace(",", "");

                try {
                    int price = Integer.parseInt(priceStr);
                    monthlyPriceMap.computeIfAbsent(yearMonth, k -> new ArrayList<>()).add(price);
                } catch (NumberFormatException e) {
                    log.warn("월별 가격 변환 실패: {}", priceStr);
                }
            }

            prices = monthlyPriceMap.entrySet().stream()
                    .map(entry -> {
                        List<Integer> monthPrices = entry.getValue();
                        int avgPrice = monthPrices.stream().mapToInt(Integer::intValue).sum() / monthPrices.size();
                        return PriceData.builder()
                                .period(entry.getKey())
                                .price(String.valueOf(avgPrice))
                                .build();
                    })
                    .collect(Collectors.toList());

        } else if ("recent".equals(period)) {
            // 주별 평균
            Map<String, List<Integer>> weeklyPriceMap = new LinkedHashMap<>();

            for (JsonNode item : allItems) {
                String currentYear = LocalDate.now().getYear() + "";
                String dateStr = item.get("regday").asText();
                LocalDate itemDate = LocalDate.parse(currentYear + "-" + dateStr, DateTimeFormatter.ofPattern("yyyy-MM/dd"));

                LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
                if (itemDate.isAfter(oneMonthAgo.minusDays(1))) {
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
                    .map(entry -> {
                        List<Integer> weekPrices = entry.getValue();
                        int avgPrice = weekPrices.stream().mapToInt(Integer::intValue).sum() / weekPrices.size();
                        return PriceData.builder()
                                .period(entry.getKey())
                                .price(String.valueOf(avgPrice))
                                .build();
                    })
                    .sorted(Comparator.comparing(PriceData::getPeriod))
                    .collect(Collectors.toList());
        }

        return prices;
    }

    private List<PriceData> calculateNormalPrices(JsonNode dataNode, String period) {
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
                            .price(String.valueOf(entry.getValue().get(0)))
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
                    .map(entry -> {
                        List<Integer> weekPrices = entry.getValue();
                        int avgPrice = (int) weekPrices.stream().mapToInt(Integer::intValue).average().orElse(0);
                        return PriceData.builder()
                                .period(entry.getKey())
                                .price(String.valueOf(avgPrice))
                                .build();
                    })
                    .sorted(Comparator.comparing(PriceData::getPeriod))
                    .collect(Collectors.toList());

            log.info("총 아이템 수: {}", allItems.size());
            log.info("월/주별 가격 맵: {}", weeklyPriceMap); // 또는 weeklyPriceMap
        }

        return prices;
    }
}