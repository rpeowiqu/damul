package com.damul.api.admin.controller;

import com.damul.api.admin.dto.request.AdminUserUpdate;
import com.damul.api.admin.dto.request.ReportStatusUpdate;
import com.damul.api.admin.dto.response.AdminUserList;
import com.damul.api.admin.dto.response.ReportList;
import com.damul.api.admin.service.AdminService;
import com.damul.api.common.page.PageResponse;
import com.damul.api.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;

    @GetMapping("/reports")
    public ResponseEntity<?> getReports(@RequestParam(required = false, defaultValue = "1") int currentPage,
                                        @RequestParam(required = false, defaultValue = "10") int pageSize,
                                        @RequestParam(required = false) String searchType,
                                        @RequestParam(required = false) String keyword) {
        log.info("컨트롤러: 신고 목록 조회 시작 - page: {}, size: {}, searchType: {}, keyword: {}",
                currentPage, pageSize, searchType, keyword);

        PageResponse<ReportList> response = reportService.getReports(currentPage, pageSize, searchType, keyword);

        if (response.getContent().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/reports/{reportId}")
    public ResponseEntity<?> getReport(@PathVariable int reportId) {
        log.info("신고 상세 조회 요청");

        log.info("신고 상세 조회 완료");
        return null;
    }

    @PatchMapping("/reports/{reportId}")
    public ResponseEntity<?> updateReportStatus(@PathVariable int reportId,
                                                @RequestBody ReportStatusUpdate request) {
        log.info("신고 상태 변경 요청");

        log.info("신고 상태 변경 완료");
        return null;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            @RequestParam(required = false, defaultValue = "1") int currentPage,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword) {
        log.info("컨트롤러: 관리자 - 유저 전체 조회 및 검색 요청 - page: {}, size: {}, searchType: {}, keyword: {}",
                currentPage, pageSize, searchType, keyword);

        PageResponse<AdminUserList> response = adminService.getUsers(currentPage, pageSize, searchType, keyword);

        if (response.getContent().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        log.info("컨트롤러: 관리자 - 유저 전체 조회 및 검색 완료");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUser(@PathVariable int userId) {
        log.info("관리자 - 유저 상세 조회 요청");


        log.info("관리자 - 유저 상세 조회 완료");
        return null;
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable int userId,
                                        @RequestBody AdminUserUpdate request) {
        log.info("관리자 - 유저 정보 수정 요청");

        log.info("관리자 - 유저 정보 수정 완료");
        return null;
    }

    @PatchMapping("/users/{userId}/reportCount")
    public ResponseEntity<?> updateReportCount(@PathVariable int userId) {
        log.info("유저 신고 횟수 수정 요청");
        
        log.info("유저 신고 횟수 수정 완료");
        return null;
    }

    @PatchMapping("/users/{userId}")
    public ResponseEntity<?> updateUserActive(@PathVariable int userId) {
        log.info("유저 활성화 여부 수정 요청");

        log.info("유저 활성화 여부 수정 완료");
        return null;
    }

    @GetMapping("/recipes")
    public ResponseEntity<?> getRecipes() {
        log.info("관리자 - 레시피 전체 조회 및 검색 요청");

        log.info("관리자 - 레시피 전체 조회 및 검색 완료");
        return null;
    }

    @GetMapping("/recipes/{recipeId}")
    public ResponseEntity<?> getRecipe(@PathVariable int recipeId) {
        log.info("관리자 - 레시피 상세 조회 요청");

        log.info("관리자 - 레시피 상세 조회 완료");
        return null;
    }

    @DeleteMapping("/recipes/{recipeId}")
    public ResponseEntity<?> deleteRecipe(@PathVariable int recipeId) {
        log.info("관리자 - 레시피 삭제 요청");

        log.info("관리자 - 레시피 삭제 완료");
        return null;
    }

    @GetMapping("/posts/{postType}")
    public ResponseEntity<?> getPosts(@PathVariable String postType) {
        log.info("관리자 - 공구/나눔 게시글 전체 조회 및 검색 요청");

        log.info("관리자 - 공구/나눔 게시글 전체 조회 및 검색 완료");
        return null;
    }

    @GetMapping("posts/{postType}/{postId}")
    public ResponseEntity<?> getPost(@PathVariable String postType,
                                     @PathVariable int postId) {
        log.info("관리자 - 공구/나눔 게시글 상세 조회 요청");

        log.info("관리자 - 공구/나눔 게시글 상세 조회 완료");
        return null;
    }

    @DeleteMapping("/posts/{postType}/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postType,
                                        @PathVariable int postId) {
        log.info("관리자 - 공구/나눔 게시글 삭제 요청");


        log.info("관리자 - 공구/나눔 게시글 삭제 완료");
        return null;
    }

}
