package com.damul.api.admin.controller;

import com.damul.api.admin.dto.response.ReportList;
import com.damul.api.admin.service.AdminService;
import com.damul.api.common.page.PageResponse;
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

    @GetMapping
    public ResponseEntity<?> getReports(@RequestParam(required = false, defaultValue = "1") int currentPage,
                                        @RequestParam(required = false, defaultValue = "10") int pageSize,
                                        @RequestParam(required = false) String searchType,
                                        @RequestParam(required = false) String keyword) {
        log.info("신고 전체 조회 및 검색 요청");
        PageResponse<ReportList> response = null;

        log.info("신고 전체 조회 및 검색 완료");
        return null;
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<?> getReport(@PathVariable int reportId) {
        log.info("신고 상세 조회 요청");

        log.info("신고 상세 조회 완료");
        return null;
    }

    
}
