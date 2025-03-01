package com.damul.api.mypage.controller;

import com.damul.api.mypage.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test/batch")
@RequiredArgsConstructor
@Profile("local")  // 로컬 환경에서만 사용 가능하도록
public class BatchTestController {

    private final BadgeService badgeService;

    @PostMapping("/badges")
    public ResponseEntity<?> runBadgeBatch() {
        badgeService.checkAndAwardBadges();
        return ResponseEntity.ok().build();
    }
}