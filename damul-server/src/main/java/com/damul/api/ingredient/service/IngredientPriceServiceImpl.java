package com.damul.api.ingredient.service;

import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.ingredient.dto.response.IngredientPriceResponse;
import com.damul.api.ingredient.dto.response.IngredientsCategoryList;
import com.damul.api.ingredient.dto.response.IngredientsCategoryResponse;
import com.damul.api.receipt.entity.FoodCategories;
import com.damul.api.receipt.repository.FoodCategoriesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IngredientPriceServiceImpl implements IngredientPriceService {
    private final KamisApiService kamisApiService;
    private final FoodCategoriesRepository foodCategoriesRepository;

    @Override
    public IngredientPriceResponse getIngredientPrice(String period, String productNo) {
        log.info("식자재 가격 동향 조회 시작");
        String action = null;

        LocalDate today = LocalDate.now();
        String regDay = today.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        log.info("현재 시간 - regDay: {}", regDay);
        try {

            if(period.equals("yearly")) {
                action = "monthlyPriceTrendList";
            } else if(period.equals("recent")) {
                action = "recentlyPriceTrendList";
            } else {
                log.error("잘못된 period 입니다.");
                throw new BusinessException(ErrorCode.INVALID_PERIOD);
            }


            String kamisResponse = kamisApiService.getPrice(regDay, productNo, action);
            // Kamis 응답 데이터를 우리 서비스에 맞게 변환
            IngredientPriceResponse response = convertToIngredientPriceResponse(kamisResponse);

            log.info("식자재 가격 동향 조회 완료");
            return response;
        } catch (Exception e) {
            log.error("식자재 가격 동향 조회 실패: {}", e.getMessage());
            throw new BusinessException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }

    @Override
    public IngredientsCategoryResponse getIngredientsCategory() {
        log.info("식자재 대분류 조회 시작");
        List<FoodCategories> foodCategories = foodCategoriesRepository.findAll();
        log.info("식자재 대분류 조회 완료");
        return IngredientsCategoryResponse.builder()
                .categories(foodCategories)
                .build();
    }


    private IngredientPriceResponse convertToIngredientPriceResponse(String kamisResponse) {
        // Kamis API 응답을 우리 서비스의 응답 형식으로 변환하는 로직
        // TODO: 실제 변환 로직 구현
        return null;
    }


}
