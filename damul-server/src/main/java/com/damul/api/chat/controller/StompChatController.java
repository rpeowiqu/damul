package com.damul.api.chat.controller;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.request.*;
import com.damul.api.chat.service.WebSocketService;
import com.damul.api.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class StompChatController {

    private final WebSocketService webSocketService;
    private final SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/chat/room/{roomId}/message")
    public void message(@DestinationVariable int roomId,
                        ChatMessageCreate messageRequest, // 이미지를 bitcode로 받는 방식 혹은 http 통신으로 이미지만 받는 방식
                        @AuthenticationPrincipal User sender) {
        webSocketService.handleMessage(roomId, messageRequest, sender);
    }

//    @MessageMapping("/chat/room/{roomId}/image")
//    public void handleImageMessage(@DestinationVariable int roomId,
//                                   ChatMessageCreate imageRequest,
//                                   @AuthenticationPrincipal User user) {
//        webSocketService.handleImageMessage(roomId, imageRequest, user);
//    }

    @MessageMapping("/chat/room/{roomId}/enter")
    public void enter(@DestinationVariable int roomId, @AuthenticationPrincipal User user) {
        webSocketService.handleEnter(roomId, user);
    }

    @MessageMapping("/chat/room/{roomId}/leave")
    public void leave(@DestinationVariable int roomId, @AuthenticationPrincipal User user) {
        webSocketService.handleLeave(roomId, user);
    }

    @MessageMapping("/chat/typing")
    public void typing(ChatTypingMessage typingRequest, @AuthenticationPrincipal User user) {
        webSocketService.handleTyping(typingRequest.getRoomId(), user, typingRequest.isTyping());
    }

    @MessageMapping("/chat/read")
    public void messageRead(ChatReadRequest readRequest, @AuthenticationPrincipal User user) {
        webSocketService.handleMessageRead(readRequest.getRoomId(), user, readRequest.getMessageId());
    }

    @MessageExceptionHandler
    public void handleException(Exception e) {
        log.error("WebSocket 메시지 처리 중 예외 발생", e);
        if (e instanceof BusinessException) {
            BusinessException be = (BusinessException) e;
            messagingTemplate.convertAndSend("/sub/chat/errors",
                    new ErrorResponse(
                            be.getErrorCode().getStatus().value(),
                            be.getMessage()
                    ));
        } else {
            messagingTemplate.convertAndSend("/sub/chat/errors",
                    new ErrorResponse(500, "서버 내부 오류가 발생했습니다."));
        }
    }

    private record ErrorResponse(int status, String message) {}
}