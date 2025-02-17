package com.damul.api.chat.controller;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.request.*;
import com.damul.api.chat.service.WebSocketService;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.user.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class StompChatController {

    private final WebSocketService webSocketService;
    private final SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/chat/room/{roomId}/message")
    public void message(@DestinationVariable int roomId,
                        ChatMessageCreate messageRequest // 이미지를 bitcode로 받는 방식 혹은 http 통신으로 이미지만 받는 방식
                        ) {
        log.info("메세지 보내기, roomId={}, senderId={}", roomId, messageRequest.getUserId());
        log.info("메세지: {}, {}", messageRequest.getContent(), messageRequest.getImage());
        webSocketService.handleMessage(roomId, messageRequest);
    }

//    @MessageMapping("/chat/room/{roomId}/image")
//    public void handleImageMessage(@DestinationVariable int roomId,
//                                   ChatMessageCreate imageRequest,
//                                   @CurrentUser UserInfo user) {
//        webSocketService.handleImageMessage(roomId, imageRequest, user);
//    }

    @MessageMapping("/chat/room/{roomId}/enter/{userId}")
    public void enter(@DestinationVariable int roomId, @DestinationVariable int userId) {
        webSocketService.handleEnter(roomId, userId);
    }

    @MessageMapping("/chat/room/{roomId}/leave/{userId}")
    public void leave(@DestinationVariable int roomId, @DestinationVariable int userId) {
        webSocketService.handleLeave(roomId, userId);
    }

    @MessageMapping("/chat/typing")
    public void typing(ChatTypingMessage typingRequest) {
        webSocketService.handleTyping(typingRequest);
    }

    @MessageMapping("/chat/read")
    public void messageRead(ChatReadRequest readRequest) {
        webSocketService.handleMessageRead(readRequest);
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