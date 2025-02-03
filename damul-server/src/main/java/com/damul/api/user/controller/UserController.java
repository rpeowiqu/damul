package com.damul.api.user.controller;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.repository.AuthRepository;
import com.damul.api.common.dto.request.ScrollRequest;
import com.damul.api.common.dto.response.ScrollResponse;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.user.dto.request.CheckNicknameRequest;
import com.damul.api.user.dto.request.FollowRequest;
import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.dto.response.FollowResponse;
import com.damul.api.user.dto.response.UserList;
import com.damul.api.user.service.FollowService;
import com.damul.api.user.service.UserService;
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

    // 설정 조회
    @GetMapping("/{userId}/settings")
    public ResponseEntity<?> getSetting(@PathVariable int userId) {
        return null;
    }

    // 설정 수정 - file 저장 구현 후 할 것!
    @PatchMapping("/{userId}/settings")
    public ResponseEntity updateSetting(@PathVariable("userId") int userId,
                                        @RequestPart("settingUpdate") SettingUpdate setting,
                                        @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
                                        @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImage) {



        return null;
    }

    // 닉네임 중복 확인
    @PostMapping("/nickname-check")
    public ResponseEntity<?> nicknameCheck(@RequestBody CheckNicknameRequest nickname) {
        log.info("닉네임 중복 확인 요청 - nickname: {}", nickname.getNickname());
        boolean isDuplicated = userService.checkNicknameDuplication(nickname.getNickname());

        // true - 존재, false - 없음
        log.info("닉네임 중복 확인 여부 - isDuplicated: {}", isDuplicated);
        return ResponseEntity.ok(isDuplicated);
    }

    // 팔로워 목록 조회
    @GetMapping("/{userId}/followers")
    public ResponseEntity<?> getFollowers(@RequestBody ScrollRequest scrollRequest,
                                          @PathVariable int userId) {
        log.info("팔로워 목록 조회 요청");
        ScrollResponse<UserList> userList = followService.getFollowers(scrollRequest, userId);

        if(userList.getData().isEmpty() || userList.getData().size() == 0) {
            log.info("팔로워 목록 조회 성공 - 데이터없음");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        log.info("팔로워 목록 조회 성공, 개수: {}", userList.getData().size());
        return ResponseEntity.ok(userList);
    }

    
    // 팔로잉 목록 조회
    @GetMapping("/{userId}/follwings")
    public ResponseEntity<?> getFollwings(@RequestBody ScrollRequest scrollRequest,
                                          @PathVariable int userId) {
        log.info("팔로잉 목록 조회 요청");
        ScrollResponse<UserList> userList = followService.getFollowings(scrollRequest, userId);

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
    @DeleteMapping
    // 사용자 목록 검색/조회


}
