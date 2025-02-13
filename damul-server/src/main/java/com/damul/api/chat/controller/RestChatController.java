package com.damul.api.chat.controller;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.chat.dto.request.ChatRoomEntryExitCreate;
import com.damul.api.chat.dto.request.ChatRoomLimitUpdate;
import com.damul.api.chat.dto.request.MultiChatRoomCreate;
import com.damul.api.chat.dto.response.*;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.service.ChatMessageService;
import com.damul.api.chat.service.ChatRoomService;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.dto.response.SearchResponse;
import com.damul.api.common.user.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
@Slf4j
public class RestChatController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

    @GetMapping("/rooms")
    public ResponseEntity<ScrollResponse<ChatRoomList>> getChatRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cursorTime,
            @RequestParam int cursor,
            @RequestParam int size,
            @CurrentUser UserInfo user
    ) {
        log.info("컨트롤러: 채팅방 목록 조회 시작 - cursor: {}, size: {}", cursor, size);

        ScrollResponse<ChatRoomList> response = chatRoomService.getChatRooms(cursorTime, cursor, size, user.getId());

        if (response.getData().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<?> getChatMessages(
            @PathVariable int roomId,
            @RequestParam int cursor,
            @RequestParam int size,
            @CurrentUser UserInfo user
    ) {
        log.info("컨트롤러: 채팅 메시지 조회 시작 - roomId: {}, cursor: {}, size: {}",
                roomId, cursor, size);

        ScrollResponse<ChatMessageResponse> response = chatMessageService.getChatMessages(
                roomId,
                cursor,
                size,
                user.getId()
        );

        if (response.getData().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<SearchResponse<ChatRoomList>> searchChatRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cursorTime,
            @RequestParam int cursor,
            @RequestParam int size,
            @CurrentUser UserInfo user
    ) {
        log.info("컨트롤러: 채팅방 검색 시작 - keyword: {}, cursor: {}, size: {}",
                keyword, cursor, size);

        SearchResponse<ChatRoomList> response = chatRoomService.searchChatRooms(
                keyword,
                cursorTime,
                cursor,
                size,
                user.getId()
        );

        if (response.getResults().getData().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/rooms/{roomId}/members")
    public ResponseEntity<?> getChatRoomMembers(@PathVariable int roomId) {
        log.info("컨트롤러: 채팅방 멤버 목록 조회 시작 - roomId: {}", roomId);

        ChatMembersResponse response = chatRoomService.getChatRoomMembers(roomId);

        if (response.getContent().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<?> deleteChatRoom(
            @PathVariable int roomId,
            @CurrentUser UserInfo user) {
        log.info("컨트롤러: 채팅방 삭제 시작 - roomId: {}", roomId);

        chatRoomService.deleteChatRoom(roomId, user.getId());

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/rooms/{roomId}/members/{memberId}")
    public ResponseEntity<?> kickMember(
            @PathVariable int roomId,
            @PathVariable int memberId,
            @CurrentUser UserInfo user) {
        log.info("컨트롤러: 채팅방 멤버 추방 시작 - roomId: {}, memberId: {}", roomId, memberId);

        chatRoomService.kickMember(roomId, memberId, user.getId());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/unreads")
    public ResponseEntity<UnReadResponse> getUnreadMessages(@CurrentUser UserInfo user) {
        log.info("컨트롤러: 전체 안 읽은 메시지 수 조회 시작 - userId: {}", user.getId());

        UnReadResponse response = chatMessageService.getUnreadMessageCount(user.getId());

        if (response.getUnReadMessageNum() == 0) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/rooms/{roomId}")
    public ResponseEntity<CreateResponse> enterChatRoom(
            @PathVariable int roomId,
            @RequestBody ChatRoomEntryExitCreate request) {
        log.info("컨트롤러: 채팅방 입장 요청 - roomId: {}", roomId);

        CreateResponse response = chatRoomService.enterChatRoom(roomId, request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/direct/{userId}")
    public ResponseEntity<CreateResponse> createDirectChatRoom(
            @PathVariable int userId,
            @CurrentUser UserInfo currentUser) {
        log.info("컨트롤러: 1:1 채팅방 생성 시작 - targetUserId: {}, currentUserId: {}",
                userId, currentUser.getId());

        CreateResponse response = chatRoomService.createDirectChatRoom(userId, currentUser.getId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/rooms")
    public ResponseEntity<CreateResponse> createMultiChatRoom(
            @RequestBody MultiChatRoomCreate request,
            @CurrentUser UserInfo user) {
        log.info("단체 채팅 생성 시작 userId: {}", user.getId());
        CreateResponse response = chatRoomService.createMultiChatRoom(request, user.getId());
        return ResponseEntity.ok(response);
    }

    // 채팅방 인원 수 변경(현재 인원보다 작게 할 수 없음)
    @PatchMapping("/{roomId}/limit")
    public ResponseEntity<ChatRoomLimitResponse> updateMemberLimit(
            @PathVariable int roomId,
            @RequestBody ChatRoomLimitUpdate request,
            @CurrentUser UserInfo user) {
        log.info("컨트롤러: 채팅방 최대 인원 변경 시작 - roomId: {}, newLimit: {}",
                roomId, request.getMemberLimit());

        ChatRoomLimitResponse response = chatRoomService.updateMemberLimit(
                roomId,
                request.getMemberLimit(),
                user.getId()
        );

        log.info("컨트롤러: 채팅방 최대 인원 변경 성공 - roomId: {}, newLimit: {}",
                roomId, request.getMemberLimit());

        return ResponseEntity.ok(response);
    }

}
