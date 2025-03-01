package com.damul.api.receipt.controller;

import com.amazonaws.Response;
import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.receipt.dto.response.ReceiptCalendarResponse;
import com.damul.api.receipt.dto.response.ReceiptDetailResponse;
import com.damul.api.receipt.service.UserReceiptService;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/receipts")
@RequiredArgsConstructor
public class ReceiptController {
    private final UserReceiptService userReceiptService;

    // 나의 구매이력 조회
    @GetMapping("/calendar")
    public ResponseEntity<?> getMonthlyReceipts(@CurrentUser UserInfo userInfo,
                                                @RequestParam(value = "year", required = false) int year,
                                                @RequestParam(value = "month", required = false) int month) {

        log.info("월별 영수증 조회 요청 - year: {}, month: {}", year, month);
        ReceiptCalendarResponse receiptCalendarResponse = userReceiptService.getMonthlyReceipt(userInfo.getId(), year, month);
        log.info("월별 영수증 조회 완료 - year: {}, month: {}", year, month);
        return ResponseEntity.ok(receiptCalendarResponse);
    }


    // 나의 영수증 보기(상세조회)
    @GetMapping("{receiptId}")
    public ResponseEntity<?> getReceiptById(@CurrentUser UserInfo userInfo,
                                            @PathVariable("receiptId") int receiptId) {
        log.info("영수증 상세 조회 요청 - receiptId: {}", receiptId);
        ReceiptDetailResponse receiptDetailResponse = userReceiptService.getReceiptDetail(userInfo.getId(), receiptId);
        log.info("영수증 상세 조회 성공 - receiptId: {}", receiptId);
        return ResponseEntity.ok(receiptDetailResponse);
    }
}
