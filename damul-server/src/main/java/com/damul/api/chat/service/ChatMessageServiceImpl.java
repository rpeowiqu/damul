package com.damul.api.chat.service;

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

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatMessageServiceImpl extends ChatValidation implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;

    @Override
    @Transactional(readOnly = true)
    public ScrollResponse<ChatMessage> getChatMessages(int roomId, int cursor, int size, int userId) {
        log.info("서비스: 채팅 메시지 조회 시작 - roomId: {}", roomId);

        validateRoomId(roomId);
        validateUserId(userId);
        validateMessageParams(cursor, size);
        validateMembership(roomId, userId);

        List<ChatMessage> messages = fetchMessages(roomId, cursor, size);

        if (messages.isEmpty()) {
            return createEmptyResponse();
        }

        log.info("서비스: 채팅 메시지 조회 성공 - roomId: {}", roomId);
        return createScrollResponse(messages, roomId);
    }

    @Override
    public UnReadResponse getUnreadMessageCount(int userId) {
        log.info("서비스: 전체 안 읽은 메시지 수 조회 시작 - userId: {}", userId);

        validateUserId(userId);

        int unreadCount = chatMessageRepository.countAllUnreadMessages(userId);

        log.info("서비스: 전체 안 읽은 메시지 수 조회 완료 - count: {}", unreadCount);

        return new UnReadResponse(unreadCount);
    }

    private void validateMembership(int roomId, int userId) {
        if (!chatRoomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            throw new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND);
        }
    }

    private List<ChatMessage> fetchMessages(int roomId, int cursor, int size) {
        return cursor == 0
                ? chatMessageRepository.findFirstPageByRoomId(roomId, size)
                : chatMessageRepository.findPreviousMessages(roomId, cursor, size);
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
