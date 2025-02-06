package com.damul.api.chat.service;

import com.damul.api.chat.dto.response.ChatRoomList;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.ScrollResponse;

public interface ChatRoomService {

    public ScrollResponse<ChatRoomList> getChatRooms(ScrollRequest request, int userId);

    public ScrollResponse<ChatRoomList> searchChatRooms(String keyword, ScrollRequest request, int userId);

}
