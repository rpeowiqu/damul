package com.damul.api.chat.controller;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.response.ChatMembersResponse;
import com.damul.api.chat.dto.response.ChatRoomList;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.service.ChatMessageService;
import com.damul.api.chat.service.ChatRoomService;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.dto.response.SearchResponse;
import com.damul.api.common.user.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
@Slf4j
public class ChatRoomController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

    @GetMapping("/rooms")
    public ResponseEntity<ScrollResponse<ChatRoomList>> getChatRooms(
            @RequestBody ScrollRequest request,
            @CurrentUser User user
    ) {
        ScrollResponse<ChatRoomList> response = chatRoomService
                .getChatRooms(request, Integer.parseInt(user.getNickname()));

        if (response.getData().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<ScrollResponse<ChatMessage>> getChatMessages(
            @PathVariable int roomId,
            @RequestBody ScrollRequest scrollRequest) {
        ScrollResponse<ChatMessage> response = chatMessageService.getChatMessages(roomId, scrollRequest);

        if (response.getData().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchChatRooms(
            @RequestParam(required = false) String keyword,
            @RequestBody ScrollRequest scrollRequest,
            @CurrentUser User user) {
        SearchResponse<ChatRoomList> response = chatRoomService.searchChatRooms(keyword, scrollRequest, user.getId());

        if (response.getResults().getData().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{roomId}/members")
    public ResponseEntity<?> getChatRoomMembers(@PathVariable int roomId) {
        log.info("컨트롤러: 채팅방 멤버 목록 조회 시작 - roomId: {}", roomId);

        ChatMembersResponse response = chatRoomService.getChatRoomMembers(roomId);

        if (response.getContent().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

}
