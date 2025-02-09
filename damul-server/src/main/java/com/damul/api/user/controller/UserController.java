package com.damul.api.user.controller;

import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.user.dto.request.CheckNicknameRequest;
import com.damul.api.user.dto.request.FollowRequest;
import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.dto.response.FollowResponse;
import com.damul.api.user.dto.response.SettingResponse;
import com.damul.api.user.dto.response.UserList;
import com.damul.api.user.service.FollowService;
import com.damul.api.user.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final FollowService followService;
    private final ObjectMapper objectMapper;

    // 설정 조회
    @GetMapping("/{userId}/settings")
    public ResponseEntity<?> getSetting(@PathVariable int userId) {
        log.info("설정 조회 요청 - userId: {}", userId);
        SettingResponse settingResponse = userService.getSetting(userId);
        log.info("설정 조회 완료 - userId: {}", userId);
        return ResponseEntity.ok(settingResponse);
    }

    // 설정 수정
    @PutMapping("/{userId}/settings")
    public ResponseEntity updateSetting(@PathVariable("userId") int userId,
                                        @RequestPart("settingUpdate") SettingUpdate setting,
                                        @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
                                        @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImage)
            throws JsonProcessingException {
//
//
//        SettingUpdate setting = objectMapper.readValue(settingJson, SettingUpdate.class);

        userService.updateUserSettings(userId, setting, profileImage, backgroundImage);
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
    public ResponseEntity<?> getFollowers(@RequestParam int cursor,
                                          @RequestParam int size,
                                          @PathVariable int userId) {
        log.info("팔로워 목록 조회 요청");
        ScrollResponse<UserList> userList = followService.getFollowers(cursor, size, userId);

        if(userList.getData().isEmpty() || userList.getData().size() == 0) {
            log.info("팔로워 목록 조회 성공 - 데이터없음");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        log.info("팔로워 목록 조회 성공, 개수: {}", userList.getData().size());
        return ResponseEntity.ok(userList);
    }

    
    // 팔로잉 목록 조회
    @GetMapping("/{userId}/follwings")
    public ResponseEntity<?> getFollwings(@RequestParam int cursor,
                                          @RequestParam int size,
                                          @PathVariable int userId) {
        log.info("팔로잉 목록 조회 요청");
        ScrollResponse<UserList> userList = followService.getFollowings(cursor, size, userId);

        if(userList.getData().isEmpty() || userList.getData().size() == 0) {
            log.info("팔로잉 목록 조회 성공 - 데이터없음");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        log.info("팔로잉 목록 조회 성공, 개수: {}", userList.getData().size());
        return ResponseEntity.ok(userList);
    }

    // 팔로우/언팔로우
    @PostMapping("/follows")
    public ResponseEntity<?> follow(@RequestBody FollowRequest followRequest) {
        log.info("팔로우/언팔로우 요청 - userId: {}, targetId: {}", followRequest.getUserId(), followRequest.getTargetId());
        FollowResponse followResponse = followService.toggleFollow(followRequest.getUserId(), followRequest.getTargetId());
        if(followResponse == null) {
            log.info("팔로우/언팔로우 실패");
            throw new IllegalArgumentException("팔로우/언팔로우에 실패하였습니다.");
        }

        return ResponseEntity.ok(followResponse);
    }

    // 팔로워 삭제
    @DeleteMapping("/{userId}/followers/{followId}")
    public ResponseEntity<?> unfollow(@PathVariable int userId, @PathVariable int followId) {
        log.info("팔로워 강제 삭제 요청 - userId: {}, followId: {}", userId, followId);
        followService.deleteFollower(userId, followId);

        log.info("팔로워 강제 삭제 성공");
        return ResponseEntity.ok().build();
    }

    // 사용자 목록 검색/조회
    @GetMapping
    public ResponseEntity<?> search(@RequestParam(required = false) String keyword) {
        log.info("사용자 목록 검색/조회 요청 - keyword: {}", keyword);
        CreateResponse createResponse = userService.getSearchUserList(keyword);
        if(createResponse == null) {
            log.info("사용자 목록 검색/조회 완료 - 데이터 없음");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            log.info("사용자 목록 검색/조회 완료");
            return ResponseEntity.ok(createResponse);
        }
    }
}
