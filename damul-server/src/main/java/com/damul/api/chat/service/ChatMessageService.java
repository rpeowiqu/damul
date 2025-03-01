package com.damul.api.chat.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.chat.dto.response.ChatImageUploadResponse;
import com.damul.api.chat.dto.response.ChatMessageResponse;
import com.damul.api.chat.dto.response.ChatScrollResponse;
import com.damul.api.chat.dto.response.UnReadResponse;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ChatMessageService {

    ChatScrollResponse<ChatMessageResponse> getChatMessages(int roomId, int cursor, int size, int userId);

    UnReadResponse getUnreadMessageCount(int userId);

    ChatImageUploadResponse uploadChatImage(int roomId, String content, MultipartFile image, UserInfo user);
}
