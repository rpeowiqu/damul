package com.damul.api.chat.service;

import com.damul.api.chat.dto.response.ChatMessageResponse;
import com.damul.api.chat.dto.response.UnReadResponse;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.chat.repository.ChatMessageRepository;
import com.damul.api.chat.repository.ChatRoomMemberRepository;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.CursorPageMetaInfo;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatMessageServiceImpl extends ChatValidation implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;

    @Override
    @Transactional(readOnly = true)
    public ScrollResponse<ChatMessageResponse> getChatMessages(int roomId, int cursor, int size, int userId) {
        log.info("서비스: 채팅 메시지 조회 시작 - roomId: {}, cursor: {}, size: {}, userId: {}", roomId, cursor, size, userId);

        validateRoomId(roomId);
        validateUserId(userId);
        validateMessageParams(cursor, size);
        validateMembership(roomId, userId);

        int lastReadMessageId = chatRoomMemberRepository.findLastReadMessageIdByUserIdAndRoomId(userId, roomId);
        List<ChatMessage> messages = fetchMessages(roomId, cursor, lastReadMessageId);

        if (messages.isEmpty()) {
            return createEmptyResponse();
        }

        Collections.reverse(messages);
        List<ChatMessageResponse> messageResponses = messages.stream()
                .map(this::convertToChatMessageResponse)
                .collect(Collectors.toList());

        log.info("서비스: 채팅 메시지 조회 성공 - roomId: {}", roomId);
        return createScrollResponse(messageResponses, roomId);
    }

    @Override
    public UnReadResponse getUnreadMessageCount(int userId) {
        log.info("서비스: 전체 안 읽은 메시지 수 조회 시작 - userId: {}", userId);

        validateUserId(userId);

        int unreadCount = chatMessageRepository.countAllUnreadMessages(userId);

        log.info("서비스: 전체 안 읽은 메시지 수 조회 완료 - count: {}", unreadCount);

        return new UnReadResponse(unreadCount);
    }

    private ChatMessageResponse convertToChatMessageResponse(ChatMessage chatMessage) {
        int unReadCount = calculateUnreadCount(chatMessage);  // 읽지 않은 수를 계산하는 메서드
        return ChatMessageResponse.from(chatMessage, unReadCount);
    }

    private int calculateUnreadCount(ChatMessage chatMessage) {
        return chatRoomMemberRepository.countUnreadMembers(
                chatMessage.getRoom().getId(),
                chatMessage.getId()
        );
    }

    private void validateMembership(int roomId, int userId) {
        if (!chatRoomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            throw new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND);
        }
    }

    private List<ChatMessage> fetchMessages(int roomId, int cursor, int lastReadMessageId) {
        return cursor == 0
                ? chatMessageRepository.findInitialMessages(roomId, lastReadMessageId)
                : chatMessageRepository.findPreviousMessages(roomId, cursor);
    }

    private ScrollResponse<ChatMessageResponse> createEmptyResponse() {
        return new ScrollResponse<>(
                Collections.emptyList(),
                new CursorPageMetaInfo(0, false)
        );
    }

    private ScrollResponse<ChatMessageResponse> createScrollResponse(List<ChatMessageResponse> messages, int roomId) {
        int nextCursor = messages.get(0).getId();
        boolean hasNext = chatMessageRepository.existsByRoomIdAndIdLessThan(roomId, nextCursor);

        return new ScrollResponse<>(
                messages,
                new CursorPageMetaInfo(nextCursor, hasNext)
        );
    }
}
