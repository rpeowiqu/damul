package com.damul.api.recipe.controller;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.util.ScrollCursor;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.recipe.dto.request.RecipeRequest;
import com.damul.api.recipe.dto.response.RecipeDetail;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.repository.RecipeRepository;
import com.damul.api.recipe.service.RecipeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.events.Comment;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/v1/recipes")
@RequiredArgsConstructor
public class RecipeController {
    private final RecipeService recipeService;
    private final RecipeRepository recipeRepository;

    // 레시피 검색 및 전체 조회
    @GetMapping
    public ResponseEntity<?> getAllRecipes(@RequestBody ScrollRequest scrollRequest,
                                           @RequestParam(required = false) String searchType,
                                           @RequestParam(required = false) String keyword,
                                           @RequestParam(required = false) String orderBy) {
        log.info("레시피 검색 및 전체 조회 시작");
        log.info("검색타입 - searchType: {}, 검색어 - keyword: {} " + searchType, keyword);
        log.info("정렬 조건 - orderBy: {} " + orderBy);

        ScrollResponse<RecipeList> scrollResponse = recipeService.getRecipes(scrollRequest, searchType, keyword, orderBy);
        if(scrollResponse.getData() == null || scrollResponse.getData().isEmpty()) {
            log.info("레시피 검색 및 전체 조회 완료 - 데이터 없음");
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(scrollResponse);
    }


    // 레시피 상세 조회
    @GetMapping("/{recipeId}")
    public ResponseEntity<RecipeDetail> getRecipe(@PathVariable int recipeId,
                                                  @CurrentUser UserInfo userInfo) {
        log.info("레시피 상세 조회 시작");
        RecipeDetail detail = recipeService.getRecipeDetail(recipeId, userInfo);
        if(detail == null) {
            log.error("레시피 상세 조회 실패 - recipeId: {}", recipeId);
            throw new BusinessException(ErrorCode.BOARD_NOT_FOUND);
        }

        return ResponseEntity.ok(detail);
    }

    // 인기 레시피 조회
    @GetMapping("/famous")
    public ResponseEntity<?> getFamous(@RequestParam int famous) {
        return null;
    }

    // 레시피 작성
    @PostMapping
    public ResponseEntity<?> addRecipe(@RequestPart("recipeRequest") RecipeRequest recipeRequest,
                                       @RequestPart("mainImage") MultipartFile mainImage,
                                       @RequestPart("cookingImages") List<MultipartFile> cookingImages) {
        return null;
    }

    // 레시피 수정
    @PutMapping("/{recipeId}")
    public ResponseEntity<?> updateRecipe(@PathVariable int recipeId,
                                          @RequestPart("recipeRequest") RecipeRequest recipeRequest,
                                          @RequestPart("thumbnailImage") MultipartFile thumbnailImage,
                                          @RequestPart("cookingImages") List<MultipartFile> cookingImages) {
        recipeService.updateRecipe(recipeRequest, thumbnailImage, cookingImages);
        return ResponseEntity.ok().build();
    }

    // 레시피 삭제
    @DeleteMapping("/{recipeId}")
    public ResponseEntity<?> deleteRecipe(@RequestParam int recipeId) {
        log.info("레시피 삭제 조회 시작 - recipeId: {}", recipeId);
        recipeService.deleteRecipe(recipeId);
        log.info("레시피 삭제 성공");
        return ResponseEntity.ok().build();
    }

    // 레시피 좋아요
    @PostMapping("/{recipeId}/likes")
    public ResponseEntity<?> updateFamous(@PathVariable int recipeId,
                                          @CurrentUser UserInfo userInfo) {
        log.info("레시피 좋아요/좋아요취소 요청");
        boolean isLiked = recipeService.toggleRecipeLike(recipeId, userInfo);
        log.info("레시피 좋아요/좋아요취소 성공");
        return ResponseEntity.ok(isLiked);
    }

    // 댓글 작성
    @PostMapping("/{recipeId}/comments")
    public ResponseEntity<?> addComment(@PathVariable int recipeId, @RequestBody Comment comment) {
        return null;
    }

    // 레시피 북마크 추가/삭제
    @PostMapping("/{recipeId}/bookmarks")
    public ResponseEntity<?> addBookmark(@PathVariable int recipeId,
                                         @CurrentUser UserInfo userInfo) {
        log.info("레시피 북마크 추가/삭제 시작 - recipeId: {}", recipeId);
        boolean isBookmarked = recipeService.toggleRecipeBookmark(recipeId, userInfo);
        log.info("레시피 북마크 추가/삭제 완료");
        return ResponseEntity.ok(isBookmarked);
    }
}
