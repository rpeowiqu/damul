package com.damul.api.mypage.controller;

import com.damul.api.auth.entity.User;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.mypage.dto.response.*;
import com.damul.api.mypage.service.MyPageService;
import com.damul.api.recipe.dto.response.RecipeList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mypages")
@RequiredArgsConstructor
@Slf4j
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("/{userId}/header")
    public ResponseEntity<?> getProfileHeader(
            @PathVariable int userId,
            @CurrentUser User currentUser) {
        log.info("컨트롤러: 마이페이지 헤더 조회 시작 - userId: {}", userId);

        ProfileHeaderDetail response = myPageService.getProfileHeader(userId, currentUser);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/profiles")
    public ResponseEntity<?> getProfile(
            @PathVariable int userId,
            @CurrentUser User currentUser) {
        log.info("컨트롤러: 마이페이지 프로필 조회 시작 - userId: {}", userId);

        ProfileDetail profileDetail = myPageService.getProfileDetail(userId, currentUser);

        if (profileDetail == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(profileDetail);
    }

    @GetMapping("/{userId}/badges")
    public ResponseEntity<BadgeResponse> getBadges(
            @PathVariable int userId,
            @CurrentUser User currentUser) {
        log.info("컨트롤러: 마이페이지 뱃지 조회 시작 - userId: {}", userId);

        List<BadgeList> badges = myPageService.getUserBadges(userId, currentUser);

        if (badges.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(new BadgeResponse(badges));
    }

    @GetMapping("/{userId}/badges/{badgeId}")
    public ResponseEntity<BadgeDetail> getBadgeDetail(
            @PathVariable int userId,
            @PathVariable int badgeId,
            @CurrentUser User currentUser) {
        log.info("컨트롤러: 마이페이지 뱃지 상세 조회 시작 - userId: {}, badgeId: {}", userId, badgeId);

        BadgeDetail badgeDetail = myPageService.getBadgeDetail(userId, badgeId, currentUser);

        return ResponseEntity.ok(badgeDetail);
    }

    @GetMapping("/{userId}/recipes")
    public ResponseEntity<?> getMyRecipes(
            @PathVariable int userId,
            @RequestParam(defaultValue = "0") int cursor,
            @RequestParam(defaultValue = "10") int size,
            @CurrentUser User currentUser) {
        log.info("컨트롤러: 마이페이지 레시피 조회 시작 - userId: {}, cursor: {}, size: {}",
                userId, cursor, size);

        ScrollResponse<MyRecipeList> response = myPageService.getMyRecipes(
                userId,
                cursor,
                size,
                currentUser
        );

        if (response.getData().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/bookmark")
    public ResponseEntity<?> getBookmarks(
            @PathVariable int userId,
            @RequestParam(defaultValue = "0") int cursor,
            @RequestParam(defaultValue = "10") int size,
            @CurrentUser User currentUser) {
        log.info("컨트롤러: 마이페이지 북마크 조회 시작 - userId: {}, cursor: {}, size: {}",
                userId, cursor, size);

        ScrollResponse<RecipeList> response = myPageService.getBookmarkedRecipes(
                userId,
                cursor,
                size,
                currentUser
        );

        if (response.getData().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }


}
