package com.damul.api.chat.service;

import com.damul.api.chat.dto.response.ChatRoomList;
import com.damul.api.common.dto.request.ScrollRequest;
import com.damul.api.common.dto.response.ScrollResponse;

public interface ChatRoomService {

    public ScrollResponse<ChatRoomList> getChatRooms(ScrollRequest request, int userId);

}
