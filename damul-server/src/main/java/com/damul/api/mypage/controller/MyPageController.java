package com.damul.api.mypage.controller;

import com.damul.api.auth.entity.User;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.mypage.dto.response.ProfileHeaderDetail;
import com.damul.api.mypage.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/mypages")
@RequiredArgsConstructor
@Slf4j
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("/{userId}/header")
    public ResponseEntity<ProfileHeaderDetail> getProfileHeader(
            @PathVariable int userId,
            @CurrentUser User currentUser) {
        log.info("컨트롤러: 마이페이지 헤더 조회 시작 - userId: {}", userId);

        ProfileHeaderDetail response = myPageService.getProfileHeader(userId, currentUser);

        return ResponseEntity.ok(response);
    }

}
