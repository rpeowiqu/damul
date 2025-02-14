package com.damul.api.chat.service;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.request.ChatMessageCreate;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoom;
import org.springframework.web.multipart.MultipartFile;

public interface WebSocketService {

    void handleMessage(int roomId, ChatMessageCreate messageRequest, User sender);

    void handleImageMessage(int roomId, ChatMessageCreate imageRequest, User user);

    void handleEnter(int roomId, User user);

    void handleLeave(int roomId, User user);

    void handleTyping(int roomId, User user, boolean isTyping);

    void handleMessageRead(int roomId, User user, int messageId);

}
