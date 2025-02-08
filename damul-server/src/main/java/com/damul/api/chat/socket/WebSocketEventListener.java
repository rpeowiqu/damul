package com.damul.api.chat.socket;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.chat.repository.ChatMessageRepository;
import com.damul.api.chat.repository.ChatRoomMemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {
    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ChatMessageRepository chatMessageRepository;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        log.info("New web socket connection. Session ID: {}", headerAccessor.getSessionId());
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        User user = (User) headerAccessor.getSessionAttributes().get("user");

        if (user != null) {
            log.info("User disconnected: {}", user.getNickname());

            // 사용자가 참여중인 모든 채팅방 찾기
            List<ChatRoomMember> userRooms = chatRoomMemberRepository.findAllByUserId(user.getId());
            for (ChatRoomMember member : userRooms) {
                ChatMessage leaveMessage = ChatMessage.createLeaveMessage(member.getRoom(), user);
                chatMessageRepository.save(leaveMessage);
                messagingTemplate.convertAndSend("/sub/chat/room/" + member.getRoom().getId(), leaveMessage);
            }
        }
    }
}