package com.damul.api.chat.controller;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.MessageType;
import com.damul.api.chat.dto.ReadStatus;
import com.damul.api.chat.dto.TypingStatus;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.chat.repository.ChatMessageRepository;
import com.damul.api.chat.repository.ChatRoomMemberRepository;
import com.damul.api.chat.repository.ChatRoomRepository;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
public class StompChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatRoomRepository chatRoomRepository;

    @Transactional
    @MessageMapping("/pub/chat/message")
    public void message(ChatMessage message) {
        try {
            chatMessageRepository.save(message);
            messagingTemplate.convertAndSend("/sub/chat/room/" + message.getRoom().getId(), message);

            if (message.getMessageType() == MessageType.TEXT) {
                updateUnreadCount(message);
            }
        } catch (Exception e) {
            log.error("메시지 처리 중 오류 발생", e);
            handleMessageError(message.getRoom().getId(), e);
        }
    }

    @MessageMapping("/chat/room/{roomId}/enter")
    public void enter(@DestinationVariable int roomId, @AuthenticationPrincipal User user) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_NOT_FOUND));

        validateChatRoomMember(roomId, user.getId());

        ChatMessage enterMessage = ChatMessage.createEnterMessage(room, user);
        chatMessageRepository.save(enterMessage);
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, enterMessage);
    }

    @MessageMapping("/chat/room/{roomId}/leave")
    public void leave(@DestinationVariable int roomId, @AuthenticationPrincipal User user) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_NOT_FOUND));

        validateChatRoomMember(roomId, user.getId());

        ChatMessage leaveMessage = ChatMessage.createLeaveMessage(room, user);
        chatMessageRepository.save(leaveMessage);
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, leaveMessage);
    }

    @MessageMapping("/chat/typing")
    public void typing(int roomId, @AuthenticationPrincipal User user, boolean isTyping) {
        ChatRoomMember member = validateChatRoomMember(roomId, user.getId());

        TypingStatus status = new TypingStatus(
                roomId,
                user.getId(),
                member.getNickname(),
                isTyping
        );

        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId + "/typing", status);
    }

    @MessageMapping("/chat/read")
    public void messageRead(int roomId, @AuthenticationPrincipal User user, int messageId) {
        ChatRoomMember member = validateChatRoomMember(roomId, user.getId());

        member.updateLastReadMessageId(messageId);
        chatRoomMemberRepository.save(member);

        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId + "/read",
                new ReadStatus(roomId, user.getId(), messageId));
    }

    @MessageMapping("/chat/file")
    public void handleFileMessage(ChatRoom room, String content, String fileUrl, @AuthenticationPrincipal User user) {
        try {
            ChatMessage message = ChatMessage.createFileMessage(room, user, content, fileUrl);
            chatMessageRepository.save(message);
            messagingTemplate.convertAndSend("/sub/chat/room/" + room.getId(), message);
            updateUnreadCount(message);
        } catch (Exception e) {
            log.error("파일 메시지 처리 중 오류 발생", e);
            handleMessageError(room.getId(), e);
        }
    }

    private ChatRoomMember validateChatRoomMember(int roomId, int userId) {
        return chatRoomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND));
    }

    private void updateUnreadCount(ChatMessage message) {
        List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(message.getRoom().getId());
        for (ChatRoomMember member : members) {
            if (member.getUser().getId() != message.getSender().getId()) {
                messagingTemplate.convertAndSend(
                        "/sub/chat/unread/" + member.getUser().getId(),
                        chatMessageRepository.countUnreadMessages(message.getRoom().getId(), member.getLastReadMessageId())
                );
            }
        }
    }

    private void handleMessageError(int roomId, Exception e) {
        String errorMessage;
        if (e instanceof BusinessException) {
            errorMessage = e.getMessage();
        } else {
            errorMessage = "메시지 처리 중 오류가 발생했습니다.";
        }
        messagingTemplate.convertAndSend("/sub/chat/error/" + roomId, errorMessage);
    }

    @MessageExceptionHandler
    public void handleException(Exception e) {
        log.error("WebSocket 메시지 처리 중 예외 발생", e);
        if (e instanceof BusinessException) {
            BusinessException be = (BusinessException) e;
            messagingTemplate.convertAndSend("/sub/chat/errors",
                    new ErrorResponse(be.getErrorCode().getStatus().value(),
                            be.getMessage()));
        } else {
            messagingTemplate.convertAndSend("/sub/chat/errors",
                    new ErrorResponse(500, "서버 내부 오류가 발생했습니다."));
        }
    }

    private record ErrorResponse(int status, String message) {}
}