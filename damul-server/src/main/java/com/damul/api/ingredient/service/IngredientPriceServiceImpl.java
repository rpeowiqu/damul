package com.damul.api.ingredient.service;

import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.ingredient.dto.response.IngredientPriceResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class IngredientPriceServiceImpl implements IngredientPriceService {
    private final KamisApiService kamisApiService;

    @Override
    public IngredientPriceResponse getIngredientPrice(String period, String productNo) {
        log.info("식자재 가격 동향 조회 시작");
        String action = null;
        try {
            if(period.equals("monthly")) {
                action = "monthlyPriceTrendList";
            } else if(period.equals("daily")) {
                action = "dailySalesList";
            }

            String yearCode = "yearlyPriceTrendList";
            String kamisResponse = kamisApiService.getPrice(period, productNo, action);
            // Kamis 응답 데이터를 우리 서비스에 맞게 변환
            IngredientPriceResponse response = convertToIngredientPriceResponse(kamisResponse);

            log.info("식자재 가격 동향 조회 완료");
            return response;
        } catch (Exception e) {
            log.error("식자재 가격 동향 조회 실패: {}", e.getMessage());
            throw new BusinessException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }


    private IngredientPriceResponse convertToIngredientPriceResponse(String kamisResponse) {
        // Kamis API 응답을 우리 서비스의 응답 형식으로 변환하는 로직
        // TODO: 실제 변환 로직 구현
        return null;
    }
}
