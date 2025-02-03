package com.damul.api.chat.service;

import com.damul.api.chat.dto.response.ChatRoomList;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.chat.repository.ChatMessageRepository;
import com.damul.api.chat.repository.ChatRoomMemberRepository;
import com.damul.api.chat.repository.ChatRoomRepository;
import com.damul.api.common.dto.request.ScrollRequest;
import com.damul.api.common.dto.response.CursorPageMetaInfo;
import com.damul.api.common.dto.response.ScrollResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;

    @Override
    public ScrollResponse<ChatRoomList> getChatRooms(ScrollRequest request, int userId) {
        log.info("서비스: 채팅 목록 가져오기 시작");
        List<ChatRoom> rooms = chatRoomRepository.findRoomsWithCursor(request.getCursorId(), request.getSize());

        if (rooms.isEmpty()) {
            return new ScrollResponse<>(Collections.emptyList(), new CursorPageMetaInfo(0, false));
        }

        List<ChatRoomList> chatRoomLists = rooms.stream()
                .map(room -> {
                    // 멤버 수 조회
                    int memberCount = chatRoomMemberRepository.countByRoomId(room.getId());

                    // 마지막 메시지 조회
                    ChatMessage lastMessage = chatMessageRepository
                            .findFirstByRoomIdOrderByCreatedAtDesc(room.getId())
                            .orElse(null);

                    // 안 읽은 메시지 수 조회
                    ChatRoomMember member = chatRoomMemberRepository
                            .findByRoomIdAndUserId(room.getId(), userId)
                            .orElseThrow(() -> new IllegalStateException("채팅방 멤버가 아닙니다."));

                    int unreadCount = chatMessageRepository
                            .countUnreadMessages(room.getId(), member.getLastReadMessageId());

                    return new ChatRoomList(
                            room.getId(),
                            room.getRoomName(),
                            null, // thumbnailUrl은 추후 구현
                            memberCount,
                            lastMessage != null ? lastMessage.getContent() : "",
                            lastMessage != null ? lastMessage.getCreatedAt().toString() : "",
                            unreadCount
                    );
                })
                .collect(Collectors.toList());

        int lastId = chatRoomLists.get(chatRoomLists.size() - 1).getId();
        boolean hasNext = chatRoomRepository.existsByIdLessThan(lastId);

        return new ScrollResponse<>(chatRoomLists, new CursorPageMetaInfo(lastId, hasNext));
    }

}
