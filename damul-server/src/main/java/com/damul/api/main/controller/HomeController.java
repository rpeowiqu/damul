package com.damul.api.main.controller;

import com.damul.api.main.dto.request.UserIngredientUpdate;
import com.damul.api.main.dto.response.HomeIngredientDetail;
import com.damul.api.main.dto.response.IngredientResponse;
import com.damul.api.main.dto.response.SelectedIngredientList;
import com.damul.api.main.service.HomeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor
@Slf4j
public class HomeController {

    private final HomeService homeService;

    @GetMapping
    public ResponseEntity<?> getUserIngredients(int userId) {
        log.info("유저 식자재 목록 조회 시작 userId: {}");
        IngredientResponse response = homeService.getUserIngredientList(userId);
        log.info("유저 식자재 목록 조회 성공");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUserIngredients(
            int userId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String orderByDir,
            @RequestParam(required = false) String orderBy) {
        log.info("유저 식자재 목록 검색 시작 userId: {}, keyword: {}, orderByDir: {}, orderBy: {}", userId, keyword, orderByDir, orderBy);
        IngredientResponse response = homeService.getSearchUserIngredientList(userId, keyword, orderByDir, orderBy);
        log.info("유저 식자재 목록 검색 성공 userId: {}, keyword: {}, orderByDir: {}, orderBy: {}", userId, keyword, orderByDir, orderBy);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/detail/{userIngredientId}")
    public ResponseEntity<?> getUserIngredient(@PathVariable int userIngredientId) {
        log.info("유저 식자재 상세보기 시작 userIngredientId: {}", userIngredientId);
        HomeIngredientDetail detail = homeService.getUserIngredientDetail(userIngredientId);
        log.info("유저 식자재 상세보기 성공 detail: {}", detail.toString());
        return ResponseEntity.ok(detail);
    }

    @GetMapping("/ingredients/selection")
    public ResponseEntity<?> getUserIngredientSelection(
            @RequestParam("ids") List<Integer> ingredientIds
            ) {
        log.info("선택된 식자재 목록 조회 시작");
        SelectedIngredientList list = homeService.getSelectedIngredientList(ingredientIds);
        log.info("선택된 식자재 목록 조회 성공");
        return ResponseEntity.ok(list);
    }

    @PatchMapping("/ingredients/{userIngredientId}")
    public ResponseEntity<?> updateUserIngredient(
            @PathVariable int userIngredientId,
            @RequestBody UserIngredientUpdate userIngredientUpdate
            ) {
        log.info("유저 식자재양 수정 시작 userIngredientId: {}, userIngredientUpdate: {}", userIngredientId, userIngredientUpdate.toString());
        homeService.updateQuantity(userIngredientId, userIngredientUpdate);
        log.info("유저 식자재양 수정 성공");
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/ingredients/{userIngredientId}")
    public ResponseEntity<?> deleteUserIngredient(@PathVariable int userIngredientId) {
        log.info("유저 식자재 삭제 시작 userIngredientId: {}", userIngredientId);
        homeService.deleteIngredient(userIngredientId);
        log.info("유저 식자재 삭제 성공");
        return ResponseEntity.ok().build();
    }

}
