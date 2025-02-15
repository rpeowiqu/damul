package com.damul.api.user.controller;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.user.dto.request.CheckNicknameRequest;
import com.damul.api.user.dto.request.FollowRequest;
import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.dto.response.FollowList;
import com.damul.api.user.dto.response.FollowResponse;
import com.damul.api.user.dto.response.SettingResponse;
import com.damul.api.user.dto.response.UserList;
import com.damul.api.user.service.FollowService;
import com.damul.api.user.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.lettuce.core.dynamic.annotation.Param;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final FollowService followService;
    private final ObjectMapper objectMapper;

    // 설정 조회
    @GetMapping("/settings")
    public ResponseEntity<?> getSetting(@CurrentUser UserInfo userInfo) {
        log.info("설정 조회 요청");
        SettingResponse settingResponse = userService.getSetting(userInfo.getId());
        log.info("설정 조회 완료");
        return ResponseEntity.ok(settingResponse);
    }

    // 설정 수정
    @PutMapping("/settings")
    public ResponseEntity updateSetting(@CurrentUser UserInfo userInfo,
                                        @RequestPart("settingUpdate") SettingUpdate setting,
                                        @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
                                        @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImage)
            throws JsonProcessingException {
        userService.updateUserSettings(userInfo.getId(), setting, profileImage, backgroundImage);
        return ResponseEntity.ok().build();
    }

    // 닉네임 중복 확인
    @PostMapping("/check-nickname")
    public ResponseEntity<?> nicknameCheck(@RequestBody CheckNicknameRequest nickname) {
        log.info("닉네임 중복 확인 요청 - nickname: {}", nickname.getNickname());
        boolean isDuplicated = userService.checkNicknameDuplication(nickname.getNickname());

        // true - 존재, false - 없음
        log.info("닉네임 중복 확인 여부 - isDuplicated: {}", isDuplicated);
        return ResponseEntity.ok(isDuplicated);
    }

    // 팔로워 목록 조회
    @GetMapping("/{userId}/followers")
    public ResponseEntity<?> getFollowers(@RequestParam(value = "keyword", required = false) String keyword,
                                          @RequestParam int cursor,
                                          @RequestParam int size,
                                          @PathVariable int userId) {
        log.info("팔로워 목록 조회 요청");
        ScrollResponse<FollowList> followList = followService.getFollowers(keyword, cursor, size, userId);

        if(followList.getData().isEmpty() || followList.getData().size() == 0) {
            log.info("팔로워 목록 조회 성공 - 데이터없음");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        log.info("팔로워 목록 조회 성공, 개수: {}", followList.getData().size());
        return ResponseEntity.ok(followList);
    }

    
    // 팔로잉 목록 조회
    @GetMapping("/{userId}/followings")
    public ResponseEntity<?> getFollowings(@RequestParam(value = "keyword", required = false) String keyword,
                                           @RequestParam int cursor,
                                          @RequestParam int size,
                                          @PathVariable int userId) {
        log.info("팔로잉 목록 조회 요청");
        ScrollResponse<FollowList> followList = followService.getFollowings(keyword, cursor, size, userId);

        if(followList.getData().isEmpty() || followList.getData().size() == 0) {
            log.info("팔로잉 목록 조회 성공 - 데이터없음");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        log.info("팔로잉 목록 조회 성공, 개수: {}", followList.getData().size());
        return ResponseEntity.ok(followList);
    }

    // 팔로우/언팔로우
    @PostMapping("/follows")
    public ResponseEntity<?> follow(@RequestBody FollowRequest followRequest,
                                    @CurrentUser UserInfo userInfo) {
        log.info("팔로우/언팔로우 요청 - userId: {}, targetId: {}", userInfo.getId(), followRequest.getTargetId());
        FollowResponse followResponse = followService.toggleFollow(userInfo.getId(), followRequest.getTargetId());
        if(followResponse == null) {
            log.info("팔로우/언팔로우 실패");
            throw new IllegalArgumentException("팔로우/언팔로우에 실패하였습니다.");
        }

        return ResponseEntity.ok(followResponse);
    }

    // 팔로워 삭제
    @DeleteMapping("/followers/{followId}")
    public ResponseEntity<?> unfollow(@CurrentUser UserInfo userInfo,
                                      @PathVariable int followId) {
        log.info("팔로워 강제 삭제 요청 - userId: {}, followId: {}", userInfo.getId(), followId);
        followService.deleteFollower(userInfo.getId(), followId);

        log.info("팔로워 강제 삭제 성공");
        return ResponseEntity.ok().build();
    }

    // 사용자 목록 검색/조회
    @GetMapping
    public ResponseEntity<?> search(@RequestParam(required = false) String keyword,
                                    @RequestParam int cursor,
                                    @RequestParam int size) {
        log.info("사용자 목록 검색/조회 요청 - keyword: {}", keyword);
        ScrollResponse<UserList> scrollResponse = userService.getSearchUserList(cursor, size, keyword);
        if(scrollResponse.getData() == null || scrollResponse.getData().isEmpty()) {
            log.info("사용자 목록 검색/조회 완료 - 데이터 없음");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            log.info("사용자 목록 검색/조회 완료");
            return ResponseEntity.ok(scrollResponse);
        }
    }
}
