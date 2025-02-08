package com.damul.api.chat.controller;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.MessageType;
import com.damul.api.chat.dto.TypingStatus;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.chat.repository.ChatMessageRepository;
import com.damul.api.chat.repository.ChatRoomMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class StompChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final SimpMessageSendingOperations messagingTemplate;

    // 메시지 발행
    @MessageMapping("/chat/message")
    public void message(ChatMessage message) {
        // 메시지 저장
        chatMessageRepository.save(message);

        // 구독자들에게 메시지 전송
        messagingTemplate.convertAndSend("/sub/chat/room/" + message.getRoom().getId(), message);

        // 채팅방 멤버들의 lastReadMessageId 업데이트 필요 시
        if (message.getMessageType() == MessageType.TEXT) {
            updateUnreadCount(message);
        }
    }

    // 입장 메시지
    @MessageMapping("/chat/enter")
    public void enter(ChatRoom room, @AuthenticationPrincipal User user) {
        ChatMessage enterMessage = ChatMessage.createEnterMessage(room, user);
        chatMessageRepository.save(enterMessage);
        messagingTemplate.convertAndSend("/sub/chat/room/" + room.getId(), enterMessage);
    }

    // 퇴장 메시지
    @MessageMapping("/chat/leave")
    public void leave(ChatRoom room, @AuthenticationPrincipal User user) {
        ChatMessage leaveMessage = ChatMessage.createLeaveMessage(room, user);
        chatMessageRepository.save(leaveMessage);
        messagingTemplate.convertAndSend("/sub/chat/room/" + room.getId(), leaveMessage);
    }

    @MessageMapping("/chat/typing")
    public void typing(int roomId, @AuthenticationPrincipal User user, boolean isTyping) {
        // 해당 채팅방의 멤버인지 확인
        ChatRoomMember member = chatRoomMemberRepository.findByRoomIdAndUserId(roomId, user.getId())
                .orElseThrow(() -> new RuntimeException("채팅방 멤버가 아닙니다."));

        // 타이핑 상태 전송
        TypingStatus status = new TypingStatus(
                roomId,
                user.getId(),
                member.getNickname(),
                isTyping
        );

        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId + "/typing", status);
    }

    private void updateUnreadCount(ChatMessage message) {
        List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(message.getRoom().getId());
        for (ChatRoomMember member : members) {
            if (member.getUser().getId() != message.getSender().getId()) {
                // 메시지 발신자가 아닌 멤버들에게 읽지 않은 메시지 수 전송
                messagingTemplate.convertAndSend(
                        "/sub/chat/unread/" + member.getUser().getId(),
                        chatMessageRepository.countUnreadMessages(message.getRoom().getId(), member.getLastReadMessageId())
                );
            }
        }
    }

}
