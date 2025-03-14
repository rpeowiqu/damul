package com.damul.api.chat.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.chat.dto.request.ChatRoomEntryExitCreate;
import com.damul.api.chat.dto.request.MultiChatRoomCreate;
import com.damul.api.chat.dto.response.ChatMembersResponse;
import com.damul.api.chat.dto.response.ChatRoomLimitResponse;
import com.damul.api.chat.dto.response.ChatRoomList;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.dto.response.SearchResponse;
import com.damul.api.post.entity.Post;

import java.time.LocalDateTime;

public interface ChatRoomService {

    ScrollResponse<ChatRoomList> getChatRooms(LocalDateTime cursorTime, int cursorId, int size, String filter, int userId);

    SearchResponse<ChatRoomList> searchChatRooms(String keyword, LocalDateTime cursorTime, int cursorId, int size, String filter, int userId);

    ChatMembersResponse getChatRoomMembers(int roomId);

    void deleteChatRoom(int roomId, int userId);

    void kickMember(int roomId, int memberId, int adminId);

    CreateResponse enterChatRoom(int roomId, ChatRoomEntryExitCreate request);

    CreateResponse createDirectChatRoom(int targetUserId, int currentUserId);

    ChatRoomLimitResponse updateMemberLimit(int roomId, int newLimit, int userId);

    CreateResponse createMultiChatRoomInPost(int currentUserId, Post post, String postName, int chatSize);

    CreateResponse createMultiChatRoom(MultiChatRoomCreate request, int userId);

}
