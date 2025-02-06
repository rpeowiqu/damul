package com.damul.api.recipe.controller;

import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.recipe.entity.Recipe;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.xml.stream.events.Comment;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/v1/recipes")
@RequiredArgsConstructor
public class RecipeController {

    // 레시피 검색 및 전체 조회
    @GetMapping
    public ResponseEntity<?> getAllRecipes(@RequestBody ScrollRequest scrollRequest,
                                           @RequestParam(required = false) String searchType,
                                           @RequestParam(required = false) String keyword,
                                           @RequestParam(required = false) String orderByDir,
                                           @RequestParam(required = false) String orderBy) {

        return null;
    }


    // 레시피 상세 조회
    @GetMapping("{recipeId}")
    public ResponseEntity<?> getRecipe(@PathVariable int recipeId) {
        return null;
    }

    // 인기 레시피 조회
    @GetMapping("/famous")
    public ResponseEntity<?> getFamous(@RequestParam int famous) {
        return null;
    }

    // 레시피 작성
    @PostMapping
    public ResponseEntity<?> addRecipe(@RequestBody Recipe recipe) {
        return null;
    }

    // 레시피 수정
    @PutMapping
    public ResponseEntity<?> updateRecipe(@RequestBody Recipe recipe) {
        return null;
    }

    // 레시피 삭제
    @DeleteMapping
    public ResponseEntity<?> deleteRecipe(@RequestParam int recipeId) {
        return null;
    }

    // 레시피 좋아요
    @PostMapping("/{recipeId}/likes")
    public ResponseEntity<?> updateFamous(@RequestParam int famous) {
        return null;
    }

    // 댓글 작성
    @PostMapping("{/{recipeId}/comments")
    public ResponseEntity<?> addComment(@PathVariable int recipeId, @RequestBody Comment comment) {
        return null;
    }

    // 레시피 북마크 추가/삭제
    @PostMapping("/{recipeId}/bookmark")
    public ResponseEntity<?> addBookmark(@PathVariable int recipeId) {
        return null;
    }

}
