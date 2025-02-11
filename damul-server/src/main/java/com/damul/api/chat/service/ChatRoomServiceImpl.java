package com.damul.api.chat.service;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.request.ChatRoomEntryExitCreate;
import com.damul.api.chat.dto.response.ChatMember;
import com.damul.api.chat.dto.response.ChatMembersResponse;
import com.damul.api.chat.dto.response.ChatRoomLimitResponse;
import com.damul.api.chat.dto.response.ChatRoomList;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.chat.repository.ChatMessageRepository;
import com.damul.api.chat.repository.ChatRoomMemberRepository;
import com.damul.api.chat.repository.ChatRoomRepository;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.scroll.dto.response.CursorPageMetaInfo;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.dto.response.SearchResponse;
import com.damul.api.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public ScrollResponse<ChatRoomList> getChatRooms(int cursor, int size, int userId) {
        log.info("서비스: 채팅방 목록 조회 시작");

        List<ChatRoom> rooms = chatRoomRepository.findRoomsWithCursor(cursor, size);

        if (rooms.isEmpty()) {
            return new ScrollResponse<>(
                    Collections.emptyList(),
                    new CursorPageMetaInfo(0, false)
            );
        }

        List<ChatRoomList> chatRoomLists = rooms.stream()
                .map(room -> convertToChatRoomList(room, userId))
                .collect(Collectors.toList());

        int lastId = rooms.get(rooms.size() - 1).getId();
        boolean hasNext = chatRoomRepository.existsByIdLessThanAndKeyword(lastId, null);

        return new ScrollResponse<>(
                chatRoomLists,
                new CursorPageMetaInfo(lastId, hasNext)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public SearchResponse<ChatRoomList> searchChatRooms(String keyword, int cursor, int size, int userId) {
        log.info("서비스: 채팅방 검색 시작 - keyword: {}", keyword);

        List<ChatRoom> rooms = chatRoomRepository.findRoomsWithCursorAndKeyword(
                cursor > 0 ? cursor : null,
                keyword,
                size
        );

        ScrollResponse<ChatRoomList> results = processRoomResults(rooms, userId);
        int totalCount = chatRoomRepository.countByKeyword(keyword);

        log.info("서비스: 채팅방 검색 완료 - 총 결과 수: {}", totalCount);
        return new SearchResponse<>(results, totalCount);
    }

    @Override
    public ChatMembersResponse getChatRoomMembers(int roomId) {
        log.info("서비스: 채팅방 멤버 목록 조회 시작 - roomId: {}", roomId);

        // 채팅방 멤버 조회
        List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(roomId);

        if (members.isEmpty()) {
            return new ChatMembersResponse(Collections.emptyList(), 0);
        }

        // 멤버 정보 변환
        List<ChatMember> chatMembers = members.stream()
                .map(member -> {
                    User user = userRepository.findById(member.getUser().getId())
                            .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다."));

                    return ChatMember.builder()
                            .id(user.getId())
                            .nickname(user.getNickname())
                            .profileImageUrl(user.getProfileImageUrl())
                            .build();
                })
                .collect(Collectors.toList());
        log.info("서비스: 채팅방 멤버 목록 조회 성공 - roomId: {}", roomId);

        return ChatMembersResponse.builder()
                .content(chatMembers)
                .totalMembers(chatMembers.size())
                .build();
    }

    @Override
    @Transactional
    public void deleteChatRoom(int roomId, int userId) {
        log.info("서비스: 채팅방 삭제 시작 - roomId: {}", roomId);

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalStateException("존재하지 않는 채팅방입니다."));

        // 채팅방 멤버 확인
        ChatRoomMember member = chatRoomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new IllegalStateException("채팅방 멤버가 아닙니다."));

        if (chatRoom.getRoomType() == ChatRoom.RoomType.PRIVATE) {
            handlePrivateRoomDeletion(chatRoom, userId);
        } else {
            handleGroupRoomDeletion(chatRoom, member);
        }

        log.info("서비스: 채팅방 삭제 완료 - roomId: {}", roomId);
    }

    @Override
    @Transactional
    public void kickMember(int roomId, int memberId, int adminId) {
        log.info("서비스: 채팅방 멤버 추방 시작 - roomId: {}, memberId: {}", roomId, memberId);

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalStateException("존재하지 않는 채팅방입니다."));

        // 개인 채팅방은 추방 불가
        if (chatRoom.getRoomType() == ChatRoom.RoomType.PRIVATE) {
            throw new IllegalStateException("개인 채팅방에서는 추방할 수 없습니다.");
        }

        // 방장 권한 확인
        ChatRoomMember admin = chatRoomMemberRepository.findByRoomIdAndUserId(roomId, adminId)
                .orElseThrow(() -> new IllegalStateException("채팅방 멤버가 아닙니다."));

        if (!admin.getRole().equals("ADMIN")) {
            throw new IllegalStateException("방장만 멤버를 추방할 수 있습니다.");
        }

        // 추방할 멤버 확인
        ChatRoomMember memberToKick = chatRoomMemberRepository.findByRoomIdAndUserId(roomId, memberId)
                .orElseThrow(() -> new IllegalStateException("추방할 멤버가 존재하지 않습니다."));

        // 방장은 추방할 수 없음
        if (memberToKick.getRole().equals("ADMIN")) {
            throw new IllegalStateException("방장은 추방할 수 없습니다.");
        }

        // 시스템 메시지 생성
        String kickMessage = String.format("%s님이 추방되었습니다.", memberToKick.getNickname());
        createSystemMessage(chatRoom, kickMessage);

        // 멤버 삭제
        chatRoomMemberRepository.delete(memberToKick);

        log.info("서비스: 채팅방 멤버 추방 완료 - roomId: {}, memberId: {}", roomId, memberId);
    }

    @Override
    public CreateResponse enterChatRoom(int roomId, ChatRoomEntryExitCreate request) {
        log.info("서비스: 채팅방 입장 시작 - roomId: {}, userId: {}", roomId, request.getId());

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 채팅방입니다."));

        if (chatRoom.getStatus() == ChatRoom.Status.INACTIVE) {
            throw new IllegalStateException("비활성화된 채팅방입니다.");
        }

        if (chatRoomMemberRepository.existsByRoomIdAndUserId(roomId, request.getId())) {
            throw new IllegalStateException("이미 채팅방에 참여중입니다.");
        }

        int currentMemberCount = chatRoomMemberRepository.countMembersByRoomId(roomId);
        if (currentMemberCount >= chatRoom.getMemberLimit()) {
            throw new IllegalStateException("채팅방 인원이 가득 찼습니다.");
        }

        User user = userRepository.getReferenceById(request.getId());

        ChatMessage lastMessage = chatMessageRepository
                .findFirstByRoomIdOrderByCreatedAtDesc(roomId)
                .orElse(null);

        int lastMessageId = lastMessage != null ? lastMessage.getId() : 0;

        ChatRoomMember newMember = ChatRoomMember.create(
                chatRoom,
                user,
                request.getNickname(),
                lastMessageId
        );

        chatRoomMemberRepository.save(newMember);

        log.info("서비스: 채팅방 입장 완료 - roomId: {}, userId: {}", roomId, request.getId());

        return new CreateResponse(roomId);
    }

    @Override
    public CreateResponse createDirectChatRoom(int targetUserId, int currentUserId) {
        log.info("서비스: 1:1 채팅방 생성 시작 - targetUserId: {}, currentUserId: {}",
                targetUserId, currentUserId);

        // 자기 자신과의 채팅방 생성 방지
        if (targetUserId == currentUserId) {
            throw new IllegalArgumentException("자기 자신과 채팅할 수 없습니다.");
        }

        // 이미 존재하는 1:1 채팅방 확인
        Optional<ChatRoom> existingRoom = chatRoomRepository
                .findExistingDirectChatRoom(currentUserId, targetUserId);

        if (existingRoom.isPresent()) {
            log.info("서비스: 이미 존재하는 채팅방 반환 - roomId: {}", existingRoom.get().getId());
            return new CreateResponse(existingRoom.get().getId());
        }

        // 대화 상대 존재 확인
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        User currentUser = userRepository.getReferenceById(currentUserId);

        // 채팅방 생성
        ChatRoom newRoom = ChatRoom.                             (
                currentUser,
                String.format("%s,%s의 대화방", currentUser.getNickname(), targetUser.getNickname())
        );

        ChatRoom savedRoom = chatRoomRepository.save(newRoom);

        // 채팅방 멤버 추가
        ChatRoomMember currentMember = ChatRoomMember.create(savedRoom, currentUser, currentUser.getNickname(), 0);
        ChatRoomMember targetMember = ChatRoomMember.create(savedRoom, targetUser, targetUser.getNickname(), 0);

        chatRoomMemberRepository.save(currentMember);
        chatRoomMemberRepository.save(targetMember);

        log.info("서비스: 1:1 채팅방 생성 완료 - roomId: {}", savedRoom.getId());

        return new CreateResponse(savedRoom.getId());
    }

    @Override
    public ChatRoomLimitResponse updateMemberLimit(int roomId, int newLimit, int userId) {
        log.info("서비스: 채팅방 최대 인원 변경 시작 - roomId: {}, newLimit: {}, userId: {}",
                roomId, newLimit, userId);

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 채팅방입니다."));

        validateRoomStatus(chatRoom);
        validateRoomType(chatRoom);
        validateCreator(chatRoom, userId);
        validateNewLimit(chatRoom, newLimit);

        chatRoom.updateMemberLimit(newLimit);

        log.info("서비스: 채팅방 최대 인원 변경 완료 - roomId: {}, newLimit: {}", roomId, newLimit);

        return new ChatRoomLimitResponse(roomId, newLimit);
    }

    private void validateRoomStatus(ChatRoom chatRoom) {
        if (chatRoom.getStatus() == ChatRoom.Status.INACTIVE) {
            throw new IllegalStateException("비활성화된 채팅방입니다.");
        }
    }

    private void validateRoomType(ChatRoom chatRoom) {
        if (chatRoom.getRoomType() == ChatRoom.RoomType.PRIVATE) {
            throw new IllegalStateException("1:1 채팅방은 인원 제한을 변경할 수 없습니다.");
        }
    }

    private void validateCreator(ChatRoom chatRoom, int userId) {
        if (chatRoom.getCreator().getId() != userId) {
            throw new IllegalStateException("채팅방 생성자만 인원 제한을 변경할 수 있습니다.");
        }
    }

    private void validateNewLimit(ChatRoom chatRoom, int newLimit) {
        if (newLimit < 2) {
            throw new IllegalArgumentException("채팅방 최대 인원은 2명 이상이어야 합니다.");
        }

        int currentMemberCount = chatRoomMemberRepository.countMembersByRoomId(chatRoom.getId());
        if (newLimit < currentMemberCount) {
            throw new IllegalStateException(
                    String.format("현재 참여 중인 인원(%d명)보다 적게 설정할 수 없습니다.", currentMemberCount)
            );
        }
    }

    private void createSystemMessage(ChatRoom chatRoom, String content) {
        ChatMessage systemMessage = ChatMessage.createSystemMessage(chatRoom, content);
        chatMessageRepository.save(systemMessage);
    }

    private void handlePrivateRoomDeletion(ChatRoom chatRoom, int userId) {
        // 개인 채팅방의 경우 양쪽 다 나가야 삭제
        List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(chatRoom.getId());

        // 현재 사용자의 멤버십만 INACTIVE로 변경
        ChatRoomMember currentMember = members.stream()
                .filter(m -> m.getUser().getId() == userId)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("채팅방 멤버가 아닙니다."));

        chatRoomMemberRepository.delete(currentMember);

        // 모든 멤버가 나갔는지 확인
        if (chatRoomMemberRepository.countByRoomId(chatRoom.getId()) == 0) {
            chatRoom.deactivate();
            chatRoomRepository.save(chatRoom);
        }
    }

    private void handleGroupRoomDeletion(ChatRoom chatRoom, ChatRoomMember member) {
        // 그룹 채팅방의 경우 방장만 삭제 가능
        if (!member.getRole().equals("ADMIN")) {
            throw new IllegalStateException("방장만 채팅방을 삭제할 수 있습니다.");
        }

        // 모든 멤버 삭제
        chatRoomMemberRepository.deleteAllByRoomId(chatRoom.getId());

        // 채팅방 상태 변경
        chatRoom.deactivate();
        chatRoomRepository.save(chatRoom);
    }

    private ScrollResponse<ChatRoomList> processRoomResults(List<ChatRoom> rooms, int userId) {
        if (rooms.isEmpty()) {
            return new ScrollResponse<>(Collections.emptyList(),
                    new CursorPageMetaInfo(0, false));
        }

        List<ChatRoomList> chatRoomLists = rooms.stream()
                .map(room -> convertToChatRoomList(room, userId))
                .collect(Collectors.toList());

        int lastId = rooms.get(rooms.size() - 1).getId();
        boolean hasNext = chatRoomRepository.existsByIdLessThanAndKeyword(lastId, null);

        return new ScrollResponse<>(chatRoomLists, new CursorPageMetaInfo(lastId, hasNext));
    }

    private ChatRoomList convertToChatRoomList(ChatRoom room, int userId) {
        int memberCount = chatRoomMemberRepository.countByRoomId(room.getId());

        ChatMessage lastMessage = chatMessageRepository
                .findFirstByRoomIdOrderByCreatedAtDesc(room.getId())
                .orElse(null);

        ChatRoomMember member = chatRoomMemberRepository
                .findByRoomIdAndUserId(room.getId(), userId)
                .orElseThrow(() -> new IllegalStateException("채팅방 멤버가 아닙니다."));

        int unreadCount = chatMessageRepository
                .countUnreadMessages(room.getId(), member.getLastReadMessageId());

        return ChatRoomList.builder()
                .id(room.getId())
                .title(room.getRoomName())
                .thumbnailUrl(room.getThumbnailUrl())
                .memberNum(memberCount)
                .lastMessage(lastMessage != null ? lastMessage.getContent() : "")
                .lastMessageTime(lastMessage != null ? lastMessage.getCreatedAt().toString() : "")
                .unReadNum(unreadCount)
                .build();
    }

}
