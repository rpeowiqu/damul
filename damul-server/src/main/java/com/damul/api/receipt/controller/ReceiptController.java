package com.damul.api.receipt.controller;

import com.damul.api.receipt.service.UserReceiptService;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/receipts")
@RequiredArgsConstructor
public class ReceiptController {
    private final UserReceiptService userReceiptService;

    // 나의 구매이력 조회
    @GetMapping("calendar")
    public ResponseEntity<?> getMonthlyReceipts(@RequestParam(value = "year", required = false) int year,
                                                @RequestParam(value = "month", required = false) int month) {

        log.info("구매 이력 전체 조회 - year: {}, month: {}", year, month);

        return null;
    }
}
