package com.damul.api.chat.service;

import com.damul.api.chat.dto.request.ChatRoomEntryExitCreate;
import com.damul.api.chat.dto.response.ChatMembersResponse;
import com.damul.api.chat.dto.response.ChatRoomList;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.CreateResponse;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.dto.response.SearchResponse;

public interface ChatRoomService {

    ScrollResponse<ChatRoomList> getChatRooms(ScrollRequest request, int userId);

    SearchResponse<ChatRoomList> searchChatRooms(String keyword, ScrollRequest request, int userId);

    ChatMembersResponse getChatRoomMembers(int roomId);

    void deleteChatRoom(int roomId, int userId);

    void kickMember(int roomId, int memberId, int adminId);

    CreateResponse enterChatRoom(int roomId, ChatRoomEntryExitCreate request);

}
