package com.damul.api.ingredient.controller;

import com.damul.api.ingredient.dto.response.IngredientPriceResponse;
import com.damul.api.ingredient.dto.response.IngredientsCategoryResponse;
import com.damul.api.ingredient.dto.response.IngredientsProductNameResponse;
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
            @RequestParam(required = false) String itemCode,
            @RequestParam(required = false) String itemCategoryCode) {
        log.info("식자재 가격 동향 조회 요청 - period: {}, itemCode: {},  itemCategoryCode: {}", period, itemCode, itemCategoryCode);

        IngredientPriceResponse response = ingredientPriceService.getIngredientPrice(period, itemCode, itemCategoryCode);

        if (response == null) {
            log.info("식자재 가격 동향 조회 성공 - 데이터 없음");
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

    @GetMapping("/categories/items")
    public ResponseEntity<?> getIngredientCategoriesItems() {
        log.info("식자재 품목 검색 요청");
        IngredientsProductNameResponse response = ingredientPriceService.getIngredientsProductName();
        if(response.getIngredientsProductNameLists() == null || response.getIngredientsProductNameLists().isEmpty()) {
            log.info("식자재 품목 검색 성공 - 데이터 없음");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        log.info("식자재 품목 검색 완료");
        return ResponseEntity.ok(response);
    }
}
