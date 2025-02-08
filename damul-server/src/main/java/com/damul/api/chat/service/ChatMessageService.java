package com.damul.api.chat.service;

import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.ScrollResponse;

public interface ChatMessageService {

    ScrollResponse<ChatMessage> getChatMessages(int roomId, ScrollRequest request, int userId);



}
