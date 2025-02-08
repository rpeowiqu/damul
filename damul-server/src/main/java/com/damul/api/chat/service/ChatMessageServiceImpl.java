package com.damul.api.chat.service;

import com.damul.api.chat.dto.response.UnReadResponse;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.chat.repository.ChatMessageRepository;
import com.damul.api.chat.repository.ChatRoomMemberRepository;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.CursorPageMetaInfo;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;

    @Override
    public ScrollResponse<ChatMessage> getChatMessages(int roomId, ScrollRequest request, int userId) {
        log.info("서비스: 채팅 메시지 조회 시작 - roomId: {}", roomId);

        ChatRoomMember member = validateAndGetMember(roomId, userId);
        List<ChatMessage> messages = fetchMessages(roomId, request, member);

        if (messages.isEmpty()) {
            return createEmptyResponse();
        }

        log.info("서비스: 채팅 메시지 조회 성공 - roomId: {}", roomId);
        return createScrollResponse(messages, roomId);
    }

    @Override
    public UnReadResponse getUnreadMessageCount(int userId) {
        log.info("서비스: 전체 안 읽은 메시지 수 조회 시작 - userId: {}", userId);

        int unreadCount = chatMessageRepository.countAllUnreadMessages(userId);

        log.info("서비스: 전체 안 읽은 메시지 수 조회 완료 - count: {}", unreadCount);

        return new UnReadResponse(unreadCount);
    }

    private ChatRoomMember validateAndGetMember(int roomId, int userId) {
        return chatRoomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new IllegalStateException("채팅방 멤버가 아닙니다."));
    }

    private List<ChatMessage> fetchMessages(int roomId, ScrollRequest request, ChatRoomMember member) {
        return request.getCursorId() == 0
                ? chatMessageRepository.findInitialMessages(roomId, member.getLastReadMessageId(), request.getSize())
                : chatMessageRepository.findPreviousMessages(roomId, request.getCursorId(), request.getSize());
    }

    private ScrollResponse<ChatMessage> createEmptyResponse() {
        return new ScrollResponse<>(
                Collections.emptyList(),
                new CursorPageMetaInfo(0, false)
        );
    }

    private ScrollResponse<ChatMessage> createScrollResponse(List<ChatMessage> messages, int roomId) {
        int nextCursor = messages.get(messages.size() - 1).getId();
        boolean hasNext = chatMessageRepository.existsByRoomIdAndIdLessThan(roomId, nextCursor);

        return new ScrollResponse<>(
                messages,
                new CursorPageMetaInfo(nextCursor, hasNext)
        );
    }
}
