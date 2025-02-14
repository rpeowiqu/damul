package com.damul.api.ingredient.controller;

import com.damul.api.ingredient.dto.response.IngredientPriceResponse;
import com.damul.api.ingredient.dto.response.IngredientsCategoryResponse;
import com.damul.api.ingredient.service.IngredientPriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/ingredients")
@RequiredArgsConstructor
public class IngredientPriceController {

    private final IngredientPriceService ingredientPriceService;

    @GetMapping("/prices")
    public ResponseEntity<?> getIngredientPrice(
            @RequestParam String period,
            @RequestParam String productNo) {
        log.info("식자재 가격 동향 조회 요청 - period: {}, productNo: {}", period, productNo);

        IngredientPriceResponse response = ingredientPriceService.getIngredientPrice(period, productNo);

        if (response == null) {
            log.info("식자재 가격 동향 조회 실패 - 데이터 없음");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        log.info("식자재 가격 동향 조회 완료");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getIngredientCategories() {
        log.info("식자재 대분류 조회 요청");
        IngredientsCategoryResponse response = ingredientPriceService.getIngredientsCategory();
        if(response.getCategories() == null || response.getCategories().isEmpty()) {
            log.info("식자재 대분류 조회 성공 - 데이터 없음");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        log.info("식자재 대분류 조회 완료");
        return ResponseEntity.ok(response);
    }
}
