package com.damul.api.main.controller;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.sse.service.SseService;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.main.dto.OcrList;
import com.damul.api.main.dto.request.UserIngredientUpdate;
import com.damul.api.main.dto.response.HomeIngredientDetail;
import com.damul.api.main.dto.response.HomeSuggestedResponse;
import com.damul.api.main.dto.response.IngredientResponse;
import com.damul.api.main.dto.response.SelectedIngredientList;
import com.damul.api.main.service.HomeService;
import com.damul.api.receipt.dto.request.UserIngredientPost;
import com.damul.api.receipt.service.UserReceiptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor
@Slf4j
public class HomeController {

    private final HomeService homeService;
    private final UserReceiptService userReceiptService;
    private final SseService sseService;

    @PostMapping("/normalize")
    public ResponseEntity<String> normalizeIngredient(@RequestBody String originalName) {
        String normalizedName = homeService.normalizeIngredient(originalName);
        return ResponseEntity.ok(normalizedName);
    }



    @GetMapping
    public ResponseEntity<?> getUserIngredients(@CurrentUser UserInfo user) {
        log.info("컨트롤러: 유저 식자재 목록 조회 시작 - userId: {}", user.getId());

        IngredientResponse response = homeService.getUserIngredientList(user.getId(), user.getId());

        if (response.getFreezer().isEmpty() && response.getFridge().isEmpty() && response.getRoomTemp().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        log.info("컨트롤러: 유저 식자재 목록 조회 완료 - userId: {}", user.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommandation")
    public ResponseEntity<HomeSuggestedResponse> getRecommendedRecipes(@CurrentUser UserInfo user) {
        log.info("컨트롤러: 레시피 추천 시작 - userId: {}", user.getId());

        HomeSuggestedResponse response = homeService.getRecommendedRecipes(user.getId());

        if (response.getSuggestedRecipes().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

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
            @RequestBody UserIngredientUpdate userIngredientUpdate,
            @CurrentUser UserInfo user
            ) {
        log.info("유저 식자재양 수정 시작 userIngredientId: {}, userIngredientUpdate: {}", userIngredientId, userIngredientUpdate.getIngredientQuantity());
        homeService.updateQuantity(userIngredientId, userIngredientUpdate, user);
        log.info("유저 식자재양 수정 성공");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/ingredients/register")
    public ResponseEntity<?> registerIngredients(
            @CurrentUser UserInfo user,
            @RequestBody UserIngredientPost request
    ) {
        log.info("컨트롤러: 식자재 등록 시작 - userId: {}", user.getId());

        userReceiptService.registerIngredients(user.getId(), request);

        log.info("컨트롤러: 식자재 등록 완료 - userId: {}", user.getId());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/ingredients/{userIngredientId}")
    public ResponseEntity<?> deleteUserIngredient(
            @PathVariable int userIngredientId,
            @RequestParam(required = false) Integer warningEnable,
            @CurrentUser UserInfo user) {
        log.info("유저 식자재 삭제 시작 userIngredientId: {}, warningEnable: {}", userIngredientId, warningEnable);
        homeService.deleteIngredient(userIngredientId, user.getId(), warningEnable);
        log.info("유저 식자재 삭제 성공");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload/{userId}")
    public ResponseEntity<?> handleImageUpload(
            @RequestParam("image") MultipartFile image,
            @PathVariable int userId
    ) {
        log.info("컨트롤러: 이미지 업로드 시작 - userId: {}", userId);

        try {
            OcrList ocrResult = homeService.processImage(image, userId);
            sseService.sendToClient(userId, ocrResult);

            log.info("컨트롤러: 이미지 업로드 완료 - userId: {}", userId);
            return ResponseEntity.ok().body(Map.of("result", ocrResult));
        } catch (Exception e) {
            log.error("이미지 처리 중 에러 발생 - userId: {}", userId, e);
            sseService.sendToClient(userId, new BusinessException(ErrorCode.BAD_REQUEST, "이미지 처리 중 오류가 발생했습니다"));
            throw e;
        }
    }



}
