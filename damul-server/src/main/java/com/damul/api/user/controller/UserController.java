package com.damul.api.user.controller;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.repository.AuthRepository;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.user.dto.request.CheckNicknameRequest;
import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // 설정 조회
    @GetMapping("{userId}/settings")
    public ResponseEntity<?> getSetting(@PathVariable int userId,
                                        @CurrentUser User user) {
        return null;
    }

    // 설정 수정
    @PatchMapping("{userId}/settings")
    public ResponseEntity updateSetting(@PathVariable("userId") int usreId,
                                        @RequestPart("settingUpdate") SettingUpdate setting,
                                        @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
                                        @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImage) {
        return null;
    }

    // 닉네임 중복 확인
    @PostMapping("nickname-check")
    public ResponseEntity<?> nicknameCheck(@RequestBody CheckNicknameRequest nickname) {
        log.info("닉네임 중복 확인 요청 - nickname: {}", nickname.getNickname());
        boolean isDuplicated = userService.checkNicknameDuplication(nickname.getNickname());
        return ResponseEntity.ok(isDuplicated);
    }

    // 팔로워 목록 조회
    @GetMapping("{userId}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable int userId) {

        return null;
    }

    
    // 팔로잉 목록 조회
    @GetMapping("{userId}/follwings")
    public ResponseEntity<?> getFollwings(@PathVariable int userId) {

        return null;
    }

    // 팔로우/언팔로우

    // 친구 삭제
    
    // 사용자 목록 검색/조회


}
