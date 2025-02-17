package com.damul.api.report.controller;

import com.amazonaws.Response;
import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.report.dto.request.ReportCreate;
import com.damul.api.report.dto.response.ReportCategoryResponse;
import com.damul.api.report.entity.Report;
import com.damul.api.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        log.info("신고 카테고리 조회 요청");
        ReportCategoryResponse response = reportService.getReportCategory();
        if(response.getContent().isEmpty() || response.getContent() == null) {
            log.info("신고 카테고리 조회 완료 - 데이터없음");
            return ResponseEntity.noContent().build();
        }

        log.info("신고 카테고리 조회 완료");
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> addReport(@RequestBody ReportCreate reportCreate,
                                       @CurrentUser UserInfo userInfo) {
        log.info("신고 추가 요청");
        CreateResponse response = reportService.addReport(reportCreate, userInfo.getId());
        log.info("신고 추가 완료");

        return ResponseEntity.ok(response);
    }
}
