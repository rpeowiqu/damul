package com.damul.api.chat.service;

import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.common.dto.request.ScrollRequest;
import com.damul.api.common.dto.response.ScrollResponse;

public interface ChatMessageService {

    ScrollResponse<ChatMessage> getChatMessages(int roomId, ScrollRequest request);



}
