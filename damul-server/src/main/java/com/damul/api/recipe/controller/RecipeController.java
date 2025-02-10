package com.damul.api.recipe.controller;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.common.comment.CommentCreate;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.recipe.dto.request.RecipeRequest;
import com.damul.api.recipe.dto.response.FamousRecipe;
import com.damul.api.recipe.dto.response.RecipeDetail;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.repository.RecipeRepository;
import com.damul.api.recipe.service.RecipeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<?> getAllRecipes(@CurrentUser UserInfo userInfo,
                                           @RequestParam int cursor,
                                           @RequestParam int size,
                                           @RequestParam(required = false) String searchType,
                                           @RequestParam(required = false) String keyword,
                                           @RequestParam(required = false) String orderBy) {
        log.info("레시피 검색 및 전체 조회 시작");
        log.info("검색타입 - searchType: {}, 검색어 - keyword: {} " + searchType, keyword);
        log.info("정렬 조건 - orderBy: {} " + orderBy);

        ScrollResponse<RecipeList> scrollResponse = recipeService.getRecipes(userInfo, cursor, size, searchType, keyword, orderBy);
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
            throw new BusinessException(ErrorCode.RECIPE_ID_NOT_FOUND);
        }

        return ResponseEntity.ok(detail);
    }

    // 인기 레시피 조회
    @GetMapping("/famous")
    public ResponseEntity<?> getFamous() {
        log.info("인기 급상승 레시피 조회 요청");
        List<FamousRecipe> topRecipes = recipeService.getFamousRecipe();
        if(topRecipes == null || topRecipes.isEmpty()) {
            log.info("인기 급상승 레시피 조회 성공 - 데이터없음: {}", topRecipes.size());
            return ResponseEntity.noContent().build();
        }
        log.info("인기 급상승 레시피 조회 성공");
        return ResponseEntity.ok(topRecipes);
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
    public ResponseEntity<?> deleteRecipe(@PathVariable int recipeId) {
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
    public ResponseEntity<?> addComment(@PathVariable int recipeId,
                                        @RequestBody CommentCreate comment,
                                        @CurrentUser UserInfo userInfo) {
        log.info("레시피 댓글 작성 요청 - recipeId: {}", recipeId);
        CreateResponse createResponse = recipeService.addRecipeComment(recipeId, comment, userInfo);
        log.info("레시피 댓글 작성 성공");

        return ResponseEntity.ok(createResponse);
    }

    // 댓글 삭제
    @DeleteMapping("/{recipeId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable("recipeId") int recipeId,
                                           @PathVariable("commentId") int commentId,
                                           @CurrentUser UserInfo userInfo) {
        log.info("댓글 삭제 요청 - recipeId: {}, commentId: {}", recipeId, commentId);
        recipeService.deleteComment(recipeId, commentId);
        log.info("댓글 삭제 완료");
        return ResponseEntity.ok().build();
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
