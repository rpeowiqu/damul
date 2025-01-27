package com.damul.api.main.controller;

import com.damul.api.main.dto.IngredientResponse;
import com.damul.api.main.service.HomeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor
@Slf4j
public class HomeController {

    private final HomeService homeService;

    @GetMapping
    public ResponseEntity<IngredientResponse> getUserIngredients(int userId) {
        log.debug("유저 식자재 목록 조회 시작 userId: {}");
        IngredientResponse ingredientResponse = homeService.getUserIngredientList(userId);
        log.debug("유저 식자재 목록 조회 성공");
        return ResponseEntity.ok(ingredientResponse);
    }

}
