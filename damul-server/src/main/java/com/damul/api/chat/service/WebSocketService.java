package com.damul.api.chat.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.request.ChatMessageCreate;
import com.damul.api.chat.dto.request.ChatReadRequest;
import com.damul.api.chat.dto.request.ChatTypingMessage;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoom;
import org.springframework.web.multipart.MultipartFile;

public interface WebSocketService {

    void handleMessage(int roomId, ChatMessageCreate messageRequest);

    void handleImageMessage(int roomId, ChatMessageCreate messageRequest);

    void handleEnter(int roomId, int userId);

    void handleLeave(int roomId, int userId);

    void handleTyping(ChatTypingMessage typingRequest);

    void handleMessageRead(ChatReadRequest readRequest);

}
