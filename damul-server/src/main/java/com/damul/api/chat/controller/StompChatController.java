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
    // 클라이언트가 /pub/chat/message로 메시지를 보내면 이 메서드가 처리
    @MessageMapping("/chat/message")
    public void message(ChatMessage message) {
        // 메시지 저장
        chatMessageRepository.save(message);

        // /sub/chat/room/{roomId}를 구독하고 있는 모든 클라이언트에게 메시지 전송
        // 예: 채팅방 1번의 구독자들은 /sub/chat/room/1을 구독 중
        messagingTemplate.convertAndSend("/sub/chat/room/" + message.getRoom().getId(), message);

        // 텍스트 메시지인 경우 읽지 않은 메시지 수 업데이트
        if (message.getMessageType() == MessageType.TEXT) {
            updateUnreadCount(message);
        }
    }

    // 사용자가 채팅방에 입장할 때 호출
    @MessageMapping("/chat/enter")
    public void enter(ChatRoom room, @AuthenticationPrincipal User user) {
        // 입장 메시지 생성 (예: "xxx님이 입장하셨습니다")
        ChatMessage enterMessage = ChatMessage.createEnterMessage(room, user);
        chatMessageRepository.save(enterMessage);
        // 해당 채팅방의 모든 구독자에게 입장 메시지 전송
        messagingTemplate.convertAndSend("/sub/chat/room/" + room.getId(), enterMessage);
    }

    // 사용자가 채팅방에서 나갈 때 호출
    @MessageMapping("/chat/leave")
    public void leave(ChatRoom room, @AuthenticationPrincipal User user) {
        // 퇴장 메시지 생성 (예: "xxx님이 퇴장하셨습니다")
        ChatMessage leaveMessage = ChatMessage.createLeaveMessage(room, user);
        chatMessageRepository.save(leaveMessage);
        // 해당 채팅방의 모든 구독자에게 퇴장 메시지 전송
        messagingTemplate.convertAndSend("/sub/chat/room/" + room.getId(), leaveMessage);
    }

    // 사용자가 메시지를 입력 중일 때 호출 (타이핑 표시 기능)
    @MessageMapping("/chat/typing")
    public void typing(int roomId, @AuthenticationPrincipal User user, boolean isTyping) {
        // 해당 채팅방의 멤버인지 확인
        ChatRoomMember member = chatRoomMemberRepository.findByRoomIdAndUserId(roomId, user.getId())
                .orElseThrow(() -> new RuntimeException("채팅방 멤버가 아닙니다."));

        // 타이핑 상태 객체 생성 (누가 타이핑 중인지)
        TypingStatus status = new TypingStatus(
                roomId,
                user.getId(),
                member.getNickname(),
                isTyping
        );

        // /sub/chat/room/{roomId}/typing을 구독 중인 클라이언트들에게
        // 타이핑 상태 전송 (예: "xxx님이 입력 중입니다")
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId + "/typing", status);
    }

    // 사용자가 메시지를 읽었을 때 호출
    @MessageMapping("/chat/read")
    public void messageRead(int roomId, @AuthenticationPrincipal User user, int messageId) {
        // 채팅방 멤버 확인
        ChatRoomMember member = chatRoomMemberRepository.findByRoomIdAndUserId(roomId, user.getId())
                .orElseThrow(() -> new RuntimeException("채팅방 멤버가 아닙니다."));

        // lastReadMessageId 업데이트
        member.updateLastReadMessageId(messageId);
        chatRoomMemberRepository.save(member);

        // 다른 사용자들에게 읽음 상태 전파
        // (예: "xxx님이 메시지를 읽었습니다")
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId + "/read",
                new ReadStatus(roomId, user.getId(), messageId));
    }

    // 파일이나 이미지 메시지 처리
    @MessageMapping("/chat/file")
    public void handleFileMessage(ChatRoom room, String content, String fileUrl, @AuthenticationPrincipal User user) {
        // 파일 메시지 생성
        ChatMessage message = ChatMessage.createFileMessage(room, user, content, fileUrl);

        chatMessageRepository.save(message);
        // 구독자들에게 파일 메시지 전송
        messagingTemplate.convertAndSend("/sub/chat/room/" + room.getId(), message);

        // 읽지 않은 메시지 수 업데이트
        updateUnreadCount(message);
    }

    // 읽지 않은 메시지 수를 업데이트하고 알림
    private void updateUnreadCount(ChatMessage message) {
        // 채팅방의 모든 멤버 조회
        List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(message.getRoom().getId());
        for (ChatRoomMember member : members) {
            if (member.getUser().getId() != message.getSender().getId()) { // 메시지 발신자를 제외한 모든 멤버에게
                // /sub/chat/unread/{userId}를 구독 중인 클라이언트에게
                // 읽지 않은 메시지 수 전송
                messagingTemplate.convertAndSend(
                        "/sub/chat/unread/" + member.getUser().getId(),
                        chatMessageRepository.countUnreadMessages(message.getRoom().getId(), member.getLastReadMessageId())
                );
            }
        }
    }

}
